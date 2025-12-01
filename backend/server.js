
// Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const readline = require('readline');               // readline for terminal debugging
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const https = require('https');
const http = require('http');
const fs = require('fs');

// Enviroment variables
require('dotenv').config();
const MONGO_URL = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_PASS = process.env.GOOGLE_PASS;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "poosdboardco@gmail.com";


// utils 
const utils = require('./utils.js');

// Create Express app
const app = express();

// read json
app.use(express.json());

// setup db connection
const client = new MongoClient(MONGO_URL);
client.connect();
const db = client.db('collabboard');

// CORS crap
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);

	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PATCH, DELETE, OPTIONS'
	);

	next();
});


// on exit procedure
function shutdown() {
	console.log('Shutting down...');
	process.exit(0);
}
process.on('SIGINT', shutdown);

/*
 *  Authentication
 */

//  key = auth token
//  value = {
//    id from database
//    expiry
//  }
const Current_Users = new Map();

// Store verification tokens temporarily (email: {token, expiry})
const verificationTokens = new Map();

// Store 2FA tokens temporarily (email: {token, expiry})
const twoFactorTokens = new Map();

// Store password reset tokens temporarily (email: {token, expiry})
const passwordResetTokens = new Map();

/*
 *  Email setup (SendGrid)
 */
sgMail.setApiKey(SENDGRID_API_KEY);
console.log("SendGrid mailer configured");


// Helper function to generate 6-digit verification code
function generateVerificationCode() {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

// Fire-and-forget mail sending so API responses return quickly
function queueMailSend(options) {
	sgMail
		.send({ ...options, from: FROM_EMAIL })
		.catch((err) => console.error("Email send failed:", err));
}

// Send verification email
app.post('/api/send-verification', async (req, res, next) => {
	const { email } = req.body;
	var error = '';
	let verificationCode = '';

	console.log("Sending verification email to: " + email);

	try {
		// Generate 6-digit code
		verificationCode = generateVerificationCode();

	// Store token with 15-minute expiry
	verificationTokens.set(email, {
		token: verificationCode,
		expiry: Date.now() + 15 * 60 * 1000 // 15 minutes
	});

	// Send email in background (fire-and-forget)
	queueMailSend({
		to: email,
		subject: "Verify your PoosdBoard email",
		text: `Your verification code is: ${verificationCode}\n\nThis code will expire in 15 minutes.`,
		html: `
			<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
					<h2 style="color: #333;">Welcome to PoosdBoard!</h2>
					<p>Thank you for signing up. Please use the following verification code to complete your registration:</p>
					<div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
						${verificationCode}
					</div>
					<p style="color: #666;">This code will expire in 15 minutes.</p>
					<p style="color: #999; font-size: 12px;">If you didn't request this verification, please ignore this email.</p>
				</div>
			`,
		});
	}
	catch(e) {
		error = e.toString();
		console.error("Error sending verification email:", error);
	}

	res.status(200).json({error: error});
});

// Verify email code
app.post('/api/verify-email', async (req, res, next) => {
	const { email, code } = req.body;
	var error = '';

	try {
		const storedData = verificationTokens.get(email);

		if (!storedData) {
			error = 'No verification code found. Please request a new one.';
		} else if (Date.now() > storedData.expiry) {
			verificationTokens.delete(email);
			error = 'Verification code expired. Please request a new one.';
		} else if (storedData.token !== code) {
			error = 'Invalid verification code.';
		} else {
			// Code is valid - update user in database
			await db.collection('users').updateOne(
				{ email: email },
				{ $set: { emailVerified: true } }
			);

			// Remove the token
			verificationTokens.delete(email);
			console.log(`Email verified for: ${email}`);
		}
	}
	catch(e) {
		error = e.toString();
		console.error("Error verifying email:", error);
	}

	res.status(200).json({error: error, verified: error === ''});
});

// Request password reset: send code if user exists
app.post('/api/request-password-reset', async (req, res, next) => {
	const { email } = req.body;
	let error = '';

	try {
		const user = await db.collection('users').findOne({ email: email });
		if (!user) {
			error = 'No account found with that email';
		} else {
			const resetCode = generateVerificationCode();
			passwordResetTokens.set(email, {
				token: resetCode,
				expiry: Date.now() + 15 * 60 * 1000 // 15 minutes
			});

			queueMailSend({
				to: email,
				subject: "Reset your PoosdBoard password",
				text: `Your password reset code is: ${resetCode}\n\nThis code will expire in 15 minutes.`,
				html: `
					<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
						<h2 style="color: #333;">Reset your PoosdBoard password</h2>
						<p>Use the following code to reset your password:</p>
						<div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
							${resetCode}
						</div>
						<p style="color: #666;">This code will expire in 15 minutes.</p>
					</div>
				`,
			});
		}
	} catch (e) {
		error = e.toString();
		console.error("Password reset request error:", error);
	}

	res.status(200).json({ error, email });
});

// Verify password reset code
app.post('/api/verify-password-reset', async (req, res, next) => {
	const { email, code } = req.body;
	let error = '';

	try {
		const stored = passwordResetTokens.get(email);
		if (!stored) {
			error = 'No reset code found. Please request a new one.';
		} else if (Date.now() > stored.expiry) {
			passwordResetTokens.delete(email);
			error = 'Reset code expired. Please request a new one.';
		} else if (stored.token !== code) {
			error = 'Invalid reset code.';
		}
	} catch (e) {
		error = e.toString();
		console.error("Password reset verify error:", error);
	}

	res.status(200).json({ error, verified: error === '' });
});

// Complete password reset
app.post('/api/reset-password', async (req, res, next) => {
	const { email, code, newPassword } = req.body;
	let error = '';

	try {
		const stored = passwordResetTokens.get(email);
		if (!stored) {
			error = 'No reset code found. Please request a new one.';
		} else if (Date.now() > stored.expiry) {
			passwordResetTokens.delete(email);
			error = 'Reset code expired. Please request a new one.';
		} else if (stored.token !== code) {
			error = 'Invalid reset code.';
		} else {
			const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
			await db.collection('users').updateOne(
				{ email: email },
				{ $set: { passwordHash: hashedPassword } }
			);
			passwordResetTokens.delete(email);
			console.log(`Password reset for: ${email}`);
		}
	} catch (e) {
		error = e.toString();
		console.error("Password reset error:", error);
	}

	res.status(200).json({ error });
});

// Signup
app.post('/api/signup', async (req, res, next) => {
	const { email, password, name } = req.body;
	var error = '';
	let verificationCode = '';

	try {
		// Check if user already exists
		const existingUser = await db.collection('users').findOne({ email: email });

		// If user exists but isn't verified, resend a code and prompt for verification
		if (existingUser && !existingUser.emailVerified) {
			verificationCode = generateVerificationCode();

			verificationTokens.set(email, {
				token: verificationCode,
				expiry: Date.now() + 15 * 60 * 1000
			});

			// Send email in background (non-blocking)
			queueMailSend({
				to: email,
				subject: "Verify your PoosdBoard email",
				text: `Your verification code is: ${verificationCode}\n\nThis code will expire in 15 minutes.`,
				html: `
					<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
						<h2 style="color: #333;">Welcome back to PoosdBoard!</h2>
						<p>We noticed you already signed up but haven't verified your email yet. Please use this code:</p>
						<div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
							${verificationCode}
						</div>
						<p style="color: #666;">This code will expire in 15 minutes.</p>
					</div>
				`,
			});

			res.status(200).json({
				error: '',
				needsEmailVerification: true,
				email: email,
				message: 'Account exists but is not verified. Sent a new code.',
				verificationCode: verificationCode
			});
			return;
		}

		if (existingUser) {
			error = "Email already registered";
		} else {
			// Hash password
			const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

			// Create new user with emailVerified set to false
			const newUser = {
				email: email,
				passwordHash: hashedPassword,
				name: name,
				createdAt: new Date(),
				emailVerified: false
			};

			// Insert user into database
			const result = await db.collection('users').insertOne(newUser);

			// Generate and send verification code
			const verificationCode = generateVerificationCode();

			// Store token with 15-minute expiry
			verificationTokens.set(email, {
				token: verificationCode,
				expiry: Date.now() + 15 * 60 * 1000
			});

			// Send verification email in background (non-blocking)
			queueMailSend({
				to: email,
				subject: "Verify your PoosdBoard email",
				text: `Your verification code is: ${verificationCode}\n\nThis code will expire in 15 minutes.`,
				html: `
					<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
						<h2 style="color: #333;">Welcome to PoosdBoard!</h2>
						<p>Thank you for signing up. Please use the following verification code to complete your registration:</p>
						<div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
							${verificationCode}
						</div>
						<p style="color: #666;">This code will expire in 15 minutes.</p>
						<p style="color: #999; font-size: 12px;">If you didn't request this verification, please ignore this email.</p>
					</div>
				`,
			});

			error = 'Signed up'; // Success message
		}
	}
	catch(e) {
		if(e.code === 11000) error = "Email already registered";
		else error = e.toString();
	}

	// Flag when the user should be shown the verification UI
	const needsVerification = error === 'Signed up' || (error && error.startsWith('Signed up'));
	var ret = {error: error, needsEmailVerification: needsVerification, email: email};
	res.status(200).json(ret);
});


// Login - Step 1: Verify credentials and send 2FA code
app.post('/api/login', async (req, res, next) => {
	var error = '';
	const { login, password } = req.body;

	try {
		// Check credentials
		const checkHash = crypto.createHash('sha256').update(password).digest('hex');
		const results = await db.collection('users').find({
			$or: [{name: login}, {email: login}],
			passwordHash: checkHash
		}).toArray();

		if(results.length === 0) {
			error = 'Invalid user/pass';
			res.status(200).json({"error": error, "requiresVerification": false});
			return;
		}

		const user = results[0];

		// Check if email is verified
		if (!user.emailVerified) {
			error = 'Please verify your email before logging in';
			res.status(200).json({
				"error": error,
				"requiresVerification": false,
				"needsEmailVerification": true,
				"email": user.email
			});
			return;
		}

		// Generate 2FA code
		const twoFactorCode = generateVerificationCode();

		// Store 2FA token with 10-minute expiry
		twoFactorTokens.set(user.email, {
			token: twoFactorCode,
			userId: user._id,
			userName: user.name,
			expiry: Date.now() + 10 * 60 * 1000
		});

		// Send 2FA email (non-blocking)
		queueMailSend({
			to: user.email,
			subject: "Your PoosdBoard Login Code",
			text: `Your 2-factor authentication code is: ${twoFactorCode}\n\nThis code will expire in 10 minutes.\n\nIf you didn't attempt to log in, please secure your account.`,
			html: `
				<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
					<h2 style="color: #333;">Login Verification</h2>
					<p>A login attempt was made to your PoosdBoard account. Please use the following code to complete your login:</p>
					<div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
						${twoFactorCode}
					</div>
					<p style="color: #666;">This code will expire in 10 minutes.</p>
					<p style="color: #999; font-size: 12px;">If you didn't attempt to log in, please ignore this email and consider changing your password.</p>
				</div>
			`,
		});

		console.log(`2FA code sent to: ${user.email}`);

		res.status(200).json({
			"error": '',
			"requires2FA": true,
			"email": user.email,
			"message": "Verification code sent to your email"
		});
		return;
	}
	catch(e) {
		error = e.toString();
		console.error("Login error:", error);
		res.status(200).json({"error": error, "requires2FA": false});
	}
});

// Login - Step 2: Verify 2FA code and issue token
app.post('/api/verify-2fa', async (req, res, next) => {
	var error = '';
	const { email, code } = req.body;

	try {
		const storedData = twoFactorTokens.get(email);

		if (!storedData) {
			error = 'No 2FA code found. Please log in again.';
		} else if (Date.now() > storedData.expiry) {
			twoFactorTokens.delete(email);
			error = '2FA code expired. Please log in again.';
		} else if (storedData.token !== code) {
			error = 'Invalid 2FA code.';
		} else {
			// Code is valid - issue JWT token
			const token = jwt.sign({id: storedData.userId}, JWT_SECRET, {expiresIn: '1h'});

			// Remove the 2FA token
			twoFactorTokens.delete(email);

			console.log(`2FA verified for: ${email}`);

			res.status(200).json({
				"auth": token,
				"name": storedData.userName,
				"error": ''
			});
			return;
		}
	}
	catch(e) {
		error = e.toString();
		console.error("2FA verification error:", error);
	}

	res.status(200).json({"error": error});
});


// Get list of ongoing games
app.get('/api/games', async (req, res, next) => {
	try {
		const gamesList = [];
		Games.forEach((game, gameId) => {
			gamesList.push({
				gameId: game.string,
				playerCount: game.players.length,
				started: game.started,
				timeStarted: game.time_start
			});
		});
		res.status(200).json({ games: gamesList, error: '' });
	} catch (e) {
		res.status(500).json({ games: [], error: e.toString() });
	}
});


// Create HTTP server that handles both Express app and WebSocket
const server = http.createServer(app);

// Setup WS server attached to HTTP server
const wss = new WebSocket.Server({ server });

// Start the server on port 5000 (IPv4) so nginx can reach it on localhost
server.listen(5000, '0.0.0.0', () => {
	console.log('Server listening on port 5000 (HTTP + WebSocket)');
});


let Games = new Map();

// Helper function to find game for a given websocket
function getCurrentGameString(ws) {
	for (let [gameString, game] of Games) {
		if (game.players.some(p => p.ws === ws)) {
			return gameString;
		}
	}
	return null;
}

// Validate bingo pattern
function validateBingo(tiles, card, pulledTiles, boardSize) {
	if (!tiles || tiles.length !== boardSize) return false;

	// Check if all selected tiles are actually marked/called
	for (let tileIndex of tiles) {
		const tileValue = card.array[tileIndex].value;
		// Free space (-1) is always valid, or tile must be in pulledTiles
		if (tileValue !== -1 && !pulledTiles.includes(tileValue)) {
			return false;
		}
	}

	// Check if tiles form a valid bingo pattern (row, column, or diagonal)
	const sortedTiles = [...tiles].sort((a, b) => a - b);

	// Check rows
	for (let row = 0; row < boardSize; row++) {
		const rowTiles = Array.from({ length: boardSize }, (_, i) => row * boardSize + i);
		if (JSON.stringify(sortedTiles) === JSON.stringify(rowTiles)) return true;
	}

	// Check columns
	for (let col = 0; col < boardSize; col++) {
		const colTiles = Array.from({ length: boardSize }, (_, i) => i * boardSize + col).sort((a, b) => a - b);
		if (JSON.stringify(sortedTiles) === JSON.stringify(colTiles)) return true;
	}

	// Check diagonal (top-left to bottom-right)
	const diag1 = Array.from({ length: boardSize }, (_, i) => i * boardSize + i);
	if (JSON.stringify(sortedTiles) === JSON.stringify(diag1)) return true;

	// Check diagonal (top-right to bottom-left)
	const diag2 = Array.from({ length: boardSize }, (_, i) => i * boardSize + (boardSize - 1 - i)).sort((a, b) => a - b);
	if (JSON.stringify(sortedTiles) === JSON.stringify(diag2)) return true;

	return false;
}

/*
 *  websocket schenanigans
 */

const { Tile, Card, Player, Owner, Game } = require("./game.js");

wss.on('connection', (ws) => {
	console.log('Client connected');
	ws.send(JSON.stringify({ type: "connection", message: "Connected" }));

	// Event listener for messages received from a client
	ws.on('message', message => {
		console.log(`Received message from client: ${message}`);

		try {

			let messageObj = JSON.parse(message);

			switch (messageObj.type) {

				/*
				 *   General Requests
				 */

				case "list games":
				// List all ongoing games
				const gamesList = [];
				Games.forEach((game, gameId) => {
					gamesList.push({
						gameId: game.string,
						playerCount: game.players.length,
						started: game.started,
						timeStarted: game.time_start
					});
				});
				ws.send(JSON.stringify({ type: "games list", games: gamesList }));
				return;

				/*
				 *   Requests for Owner
				 */

				case "new game":

				// create new game
				/*
				 *  JSON requirements:
				 *    - messageObj.type === "new game"
				 *    - owner name
				 *    - owner auth token to verify signed in
				 *    - game settings?
				 *      - time till pull?
				 *      - board size maybe?
				 *
				 */
				// TODO authenticate user as logged in to start game

				// End all existing games for this host
				const gamesToRemove = [];
				Games.forEach((game, gameId) => {
					if (game.owner.auth == messageObj.auth) {
						console.log(`Ending previous game ${gameId} for host`);

						// Clear the update interval
						if (game.intervalID) {
							clearInterval(game.intervalID);
						}

						// Notify all players that the game has ended
						game.players.forEach((player) => {
							try {
								if (player.ws && player.ws.readyState === WebSocket.OPEN) {
									player.ws.send(JSON.stringify({ 
										type: "game ended", 
										reason: "Host started a new game" 
									}));
								}
							} catch (err) {
								console.error('Error notifying player:', err);
							}
						});

						// Mark for removal
						gamesToRemove.push(gameId);
					}
				});

				// Remove the old games
				gamesToRemove.forEach(gameId => {
					Games.delete(gameId);
					console.log(`Removed game ${gameId} from active games`);
				});

				// make new game
				let str = generateGameString();
				Games.set(str, new Game(str, messageObj, ws));
				ws.gameStr = str;
				ws.send(JSON.stringify({type: 'new game success', gameString: str}));

				return;

				case "reconnect host":
				/*
				 *  JSON requirements:
				 *    - type === "reconnect host"
				 *    - gameString - the game ID to reconnect to
				 *    - auth - auth token to verify ownership
				 */

				console.log(`\n>>> RECONNECT HOST request received`);
				console.log(`    Game string: "${messageObj.gameString}"`);

				if (!messageObj.gameString || messageObj.gameString === "") {
					ws.send(JSON.stringify({ type: "error", error: 'invalid game string' }));
					return;
				}

				let reconnectGame = Games.get(messageObj.gameString);

				if (!reconnectGame) {
					console.log(`Game not found: ${messageObj.gameString}`);
					ws.send(JSON.stringify({ type: "error", error: 'game not found' }));
					return;
				}

				// Verify auth token matches (optional but recommended)
				if (messageObj.auth && reconnectGame.owner.auth !== messageObj.auth) {
					console.log(`Auth mismatch for game ${messageObj.gameString}`);
					ws.send(JSON.stringify({ type: "error", error: 'unauthorized' }));
					return;
				}

				console.log(`Host reconnecting to game ${messageObj.gameString}`);

				// Update the owner's websocket
				reconnectGame.owner.ws = ws;
				ws.gameStr = messageObj.gameString;

				// Send back the current game state
				ws.send(JSON.stringify({
					type: 'reconnect host success',
					gameString: messageObj.gameString,
					state: reconnectGame.getGameState()
				}));

				console.log(`>>> RECONNECT HOST complete\n`);
				return;

				case "game start":
				/*
				 *  JSON requirements:
				 *    - type === "game start"
				 *    - game str
				 */
				let startGame = Games.get(ws.gameStr);

				// Mark game as started
				startGame.started = true;

				// Notify all players that the game has started
				startGame.players.forEach((player) => {
					player.ws.send(JSON.stringify({ type: "game start" }));
				});

				ws.send(JSON.stringify({ type: "game start success" }));
				return;

				case "game pull tile":

				/*
				 *  JSON requirements:
				 *    - type === "game new tile"
				 *    - game str
				 */

				let pullGame = Games.get(ws.gameStr);
				let tile = pullGame.pullTile();
				//game.gameStateChanged = true;

				// notify all players
				pullGame.players.forEach( (player) => {
					player.ws.send( JSON.stringify( { type: "game update", state: pullGame.getGameState() } ) );
				});

				let numPlayersWith = pullGame.getNumPlayersWithCard(tile);

				ws.send( JSON.stringify( { type: "game new tile success", tile: tile, numPlayersWith: numPlayersWith } ) );

				return;

				/*
				 *  Requests for players
				 */

				case "join game":
				// if setting up new player
				/*
				 *  JSON requirements:
				 *    - messageObj.type === "join game"
				 *    - player name (for display)
				 *    - game str
				 */

				console.log(`\n>>> JOIN GAME request received`);
				console.log(`    Player name: "${messageObj.playerName}"`);
				console.log(`    Game string: "${messageObj.string}"`);

				// TODO json checks to make sure all fields valid
				if (!messageObj.playerName || messageObj.playerName === "") {
					ws.send(JSON.stringify({ type: "error", error: 'invalid player name' }));
					return;
				}

				if (!messageObj.string || messageObj.string === "") {
					ws.send(JSON.stringify({ type: "error", error: 'invalid game string' }));
					return;
				}

				let joinGame = Games.get(messageObj.string);

				if (!joinGame) {
					console.log(`Game not found: ${messageObj.string}`);
					ws.send(JSON.stringify({ type: "error", error: 'game not found' }));
					return;
				}

				console.log(`Player ${messageObj.playerName} joining game ${messageObj.string}`);

				let playerId = joinGame.addPlayer(messageObj.playerName, ws);

				ws.playerId = playerId; // attach player id to ws for future ref
				ws.gameStr = messageObj.string; // attach game str to ws for future ref

				console.log(`>>> Player ID ${playerId} assigned to ${messageObj.playerName}`);
				console.log(`    Sending board from index: ${playerId}`);
				console.log(`    Board numbers:`, joinGame.players[playerId].card.array.map(t => t.value));

				ws.send(JSON.stringify({
					type: "join player success", 
					board: joinGame.players[playerId].card,  // playerId is now 0-indexed
					playerId: playerId,
					started: joinGame.started,
					pulledTiles: joinGame.pulledTiles
				}));

				console.log(`>>> JOIN GAME complete. Notifying host...\n`);

				// Notify host of new player
				console.log(`Notifying host of game ${messageObj.string} about new player`);
				joinGame.owner.ws.send(JSON.stringify({ type: "game update", state: joinGame.getGameState() }));

				//game.gameStateChanged = true;

				return;

				case "mark cell":

				// mark tile
				/*
				 *  JSON requirements:
				 *  - type === "mark cell"
				 *  - tileIndex
				 *
				 */
				let markGame = Games.get(ws.gameStr);
				let markPlayer = markGame.players[ws.playerId];  // playerId is now 0-indexed

				// Allow marking -1 (free space) without checking pulledTiles
				const tileValue = markPlayer.card.array[messageObj.tileIndex].value;
				if (tileValue !== -1 && !markGame.pulledTiles.includes(tileValue)) {
					ws.send(JSON.stringify({type: "mark cell fail", error: 'tile not pulled yet'}));
					return;
				}

				markPlayer.card.array[messageObj.tileIndex].marked = true;

				ws.send(JSON.stringify({type: "mark cell success", index: messageObj.tileIndex}));
				return;

				case "check bingo":

				// check for bingo
				/*
				 *   JSON requirements:
				 *   type === "bingo check"
				 *   tiles[] - containing the n tile indexes that supposedly have bingo
				 *
				 */
				let bingoGame = Games.get(ws.gameStr);

				if (!bingoGame) {
					ws.send(JSON.stringify({ type: "error", error: "Game not found" }));
					return;
				}

				let bingoPlayer = bingoGame.players[ws.playerId];

				if (!bingoPlayer) {
					ws.send(JSON.stringify({ type: "error", error: "Player not found" }));
					return;
				}

				let tiles = messageObj.tiles;

				// Validate the bingo pattern
				const isValidBingo = validateBingo(tiles, bingoPlayer.card, bingoGame.pulledTiles, bingoGame.options.board_size);

				if (isValidBingo) {
					console.log(`🎉 BINGO! Player ${bingoPlayer.name} (ID: ${bingoPlayer.playerId}) won the game!`);

					// Send success to the player
					ws.send(JSON.stringify({ type: "bingo check success" }));

					// Notify the host about the winner
					bingoGame.owner.ws.send(JSON.stringify({ 
						type: "game finished", 
						winnerName: bingoPlayer.name,
						winnerPlayerId: bingoPlayer.playerId
					}));

					// Optionally notify all other players
					bingoGame.players.forEach(p => {
						if (p.ws !== ws && p.ws.readyState === WebSocket.OPEN) {
							try {
								p.ws.send(JSON.stringify({ 
									type: "game finished", 
									winnerName: bingoPlayer.name 
								}));
							} catch (err) {
								console.error('Error notifying player:', err);
							}
						}
					});
				} else {
					console.log(`❌ Invalid bingo claim from ${bingoPlayer.name}`);
					ws.send(JSON.stringify({ 
						type: "bingo check fail", 
						error: "Invalid bingo pattern or unmarked numbers" 
					}));
				}

				return;

				default:
				ws.send(JSON.stringify({ error: 'invalid message type' }));
				return;
			}

		} catch (e) {
			ws.send(JSON.stringify({ error: 'invalid message', message: e }));
		}

	});

	ws.on('close', () => {
		console.log('Client disconnected');
	});

	ws.on('error', (error) => {
		console.error('WebSocket error:', error);
	});
});


/*
 *  Util Functions
 */

// stolen from ai lol

/*
// Generate a random integer between 1 and 10 (inclusive)
function getRandomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// generate a random str 
function generateGameString() {
	// Generate a 6-digit numeric game ID
	return String(Math.floor(100000 + Math.random() * 900000));
}
*/

// generate and auth key somehow
function generateAuth() {
	return "disdaauthkey";
}

/*
 *  Read and print to terminal for debugging
 *  bc i dont have postman to test properly
 */

// Only enable readline interface if running in interactive mode (not in background)
if (process.stdin.isTTY) {
	// Create the readline interface to listen for terminal input
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: 'SERVER > ', // Set a custom prompt
	});

	// Listen for 'line' events from the terminal
	rl.on('line', (line) => {
		const command = line; // Normalize the command

		if (command === "help") {

			console.log(`
	    --  Server Help --
	    help      -   runs this command
	    print xxx -   executes xxx inside of a console.log()
	    `);
		} else {
			try {
				console.log(eval(line));
			} catch (error) {
				console.log("Invalid command");
			}
		}

		rl.prompt(); // Display the prompt again for the next command
	});

	rl.on('close', () => {
		console.log('Terminating input listener.');
		shutdown();
	});

	rl.prompt();
} else {
	console.log('Running in background mode - readline interface disabled');
}

module.exports = { generateGameString };
