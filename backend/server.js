
// Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

// Enviroment variables
require('dotenv').config();
const url = process.env.MONGODB_URI;

// Create Express app
const app = express();

// setup db connection
const client = new MongoClient(url);
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
process.on('SIGINT', async () => {
    console.log('Shutting down...');
    clients.forEach(client => client.close());
    await pool.end();
    process.exit(0);
});

// Listen on 5000 for Get/Post requests
app.listen(5000);


// Signup 
app.post('/api/signup', async (req, res, next) => {
    const { email, password, name } = req.body;
    const newUser = {email: email, passwordHash: password, name: name, createdAt: new Date(), emailVerified: true};
    var error = '';
    try {
        const result = await db.collection('users').insertOne(newUser);
        error = 'Signed up';
    }

    catch(e) {
        error = e.toString();
    }
    var ret = {error: error};
    res.status(200).json(ret);
});


// Login
app.post('/api/login', async (req, res, next) => {
    var error = '';
    const { login, password } = req.body;
    const results = await
        db.collection('users').find({
            $or: [{name: login}, {email: login}],
            passwordHash: password
        }).toArray();

    var id = -1;
    var n = '';

    if(results.length > 0) {
        id = results[0]._id;
        n = results[0].name;
    }
    else error = 'Invalid user/pass';

    // testing
    const token = jwt.sign({id}, JWT_SECRET, {expiresIn: '1h'});
    res.status(200).json({token});

    var ret = {id: id, name: n, error:''};
    res.status(200).json(ret);
});


/*
 *    Bingo Game and Websocket shenanigans
 */

const DEFAULT_BOARD_SIZE = 5;
const DEFAULT_BALL_NUMS = 75;

/*  bingo generation rules: https://www.sciencenews.org/article/probabilities-bingo 
 *  first column: random between 1-15
 *  second 16-30
 *  31-45, except for middle which is -1 (free)
 *  46-60
 *  61-75
 *
 *  extending for bigger board sizes (?), num balls is 3x the num of tiles 
 *  with each column having 1/x of the nums dedicated to it
 *  median tile is free
 */

// Class for each tile on the board
class Tile {
    constructor(i, game_options) {
        value = generateValue(i, game_options);
        marked = false;
    }

    // generate tiles value acc to rules above
    generateValue(i, game_options) {
        let { board_size, num_balls } = game_options;

        let column = Math.floor((i-1)/board_size) + 1;
        let min = num_balls/board_size * (column - 1) + 1;  // ex: 75/5 * 0 + 1->(15*0) + 1; 1, 16, 31 etc
        let max = num_balls/board_size * (column);          // ex: 75/5 * x; 15, 30, 45  
        return getRandomInteger(min, max);
    }

    // serialize
    serialize() {
        return `{"value": ${value}, "marked": ${marked}}`;
    }
} 

class Card {

    constructor (game_options) {
        let arr = [];
        for (let index = BOARD_SIZE*BOARD_SIZE; index < array.length; index++) {
            array.add(new Tile(i, game_options)); 
        }
    }

    serialize() {
        let str = `"card": { "arr": [`;
        for (let index = 0; index < arr.length; index++) {
            str += arr[index].serialize() + `,`
        }
        str += `] }`;
        return str;
    }

    unserialize(str) {
        
    }
}

class Owner {
    constructor(_ws, auth) {
        name = _name;   // display name  
        id = _id;       // player id if logged in, else null
        ws = _ws;       // current websocket
        auth = _auth;   // auth token
    }
}
class Player {
    constructor(_name, _ws, auth) {
        name = _name;   // display name if provided 
        id = _id;       // player id if logged in, else null
        ws = _ws;       // current websocket
        auth = _auth;   // auth token
    }
}

class Game {
    constructor(_game_str, _messageObj, _ws) {
        string = _game_str;                     // string to identify the game
        options = _messageObj.game_options;  // game_options like board size, num balls etc

        owner = new Owner(ws, _messageObj.auth);  // set owner  
        players = new Map();

        time_start = Date.now();
        intervalID = setInterval(update(), interval);
    }

    addPlayer(name, ws, auth) {
        players.add(auth, new Player(name, ws, auth));
    }

    update() {
        
    }
}

let Games = new Map();

// Setup WS server
const wss = new WebSocket.Server({ port: 8080 });

// On WSS startup, log it
wss.on('listening', () => {
    console.log('WebSocket server listening on port 8080');
});


wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.send("herro from da server");

    // Event listener for messages received from a client
    ws.on('message', message => {
        console.log(`Received message from client: ${message}`);

        try {

            let messageObj = JSON.parse(message);

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
            if (messageObj.type === "new game") {

                // TODO authenticate user as logged in to start game

                // Check for if host alr has game running (disconnection)
                Games.forEach((value, game) => {
                    if (game.owner.auth == messageObj.auth) {
                        game.owner.ws = ws; // and proceed as usual? idk
                        return;
                    }
                });

                // make new game
                let str = generateGameString();
                Games.set(str, new Game(str, messageObj, ws));

            }

            // if setting up new player
            /*
             *  JSON requirements:
             *    - messageObj.type === "join game"
             *    - player name (for display)
             *    - game str
             *    i think thats it actually
             *
             *    need to generate an auth token and return it
             */
            if (messageObj.type === "join game") {

                // TODO json checks to make sure all fields valid
                if (messageObj.name == null || messageObj.name == "")
                    ws.send("{'error': 'invalid message'}");

                let auth = generateAuth() // TODO

                Games.get(messageObj.gameStr).addPlayer(name, ws, auth);

                ws.send(`{"auth": ${auth}}`) // TODO other info? board?
            }

            // mark tile
            /*
             *  JSON requirements:
             *  - auth token
             *  - type === "mark tile"
             *  - game str
             *
             */
            if (messageObj.type === "mark tile") {
               
                let game = Games.get(messageObj.gameStr);
                game.players.get(messageObj.auth);



            }

            // check for bingo
            /*
             *  JSON requirements:
             *  
             *
             */
            if (messageObj.type === "check bingo") {
                
            }

            // sample message for cpy paste
            /*
             *  JSON requirements:
             *  - auth token
             *
             */
            if (messageObj.type === "") {

            }




        } catch (e) {
            ws.send("{'error': 'invalid message'}");
        }

        // Optionally, send a response back to the client
        ws.send(`Server received your message: ${message}`);
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
// Generate a random integer between 1 and 10 (inclusive)
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// generate a random str 
function generateGameString() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// generate and auth key somehow
function generateAuth() {
    return "disdaauthkey";
}
