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
        this.value = this.generateValue(i, game_options);
        this.marked = false;
    }

    // generate tiles value acc to rules above
    generateValue(i, game_options) {
        let { board_size, num_balls } = game_options;

        let column = Math.floor(i % board_size);  // 0-indexed column
        let min = num_balls/board_size * column + 1;  // ex: 75/5 * 0 + 1->(15*0) + 1; 1, 16, 31 etc
        let max = num_balls/board_size * (column + 1);  // ex: 75/5 * 1; 15, 30, 45  
        return getRandomInteger(min, max);
    }
}

class Card {

    // take in game options, go
    constructor (go) {
        this.array = [];
        // Calculate center tile index (0-indexed)
        const centerIndex = Math.floor((go.board_size * go.board_size) / 2);

        for (let index = 0; index < go.board_size * go.board_size; index++) {

            // Center tile is always -1 (free space)
            if (index === centerIndex) {
                this.array.push({ value: -1, marked: false });
                continue;
            }

            let i = 0;

            while (i < 1000) {

                let t = new Tile(index, go);

                if (!this.array.some(item => item.value === t.value)){
                    this.array.push(t);
                    break;
                }
                i++;
            }
            if (i >= 1000) {
                console.log("card builder is no worky")
            }
        }
    }
}

class Owner {
    constructor(_ws, _auth) {
        //name = _name;   // display name  
        //id = _id;       // player id if logged in, else null
        this.ws = _ws;       // current websocket
        this.auth = _auth;   // auth token
    }
}

class Player {
    constructor(_name, _ws, _playerId, _game) {
        console.log(`  → Creating Player object: name="${_name}", playerId=${_playerId}`);
        this.name = _name;   // display name if provided 
        this.ws = _ws;       // current websocket
        this.playerId = _playerId;
        this.game = _game;

        this.card = new Card(this.game.options);
        console.log(`  → Player created with card containing ${this.card.array.length} tiles`);
    }
}

class Game {
    constructor(_game_str, _messageObj, _ws) {
        this.string = _game_str;                     // string to identify the game

        // game_options like board size, num balls etc
        this.options = {};
        this.options.board_size = _messageObj.boardsize ? _messageObj.board_size : DEFAULT_BOARD_SIZE;
        this.options.num_balls = _messageObj.num_balls ? _messageObj.num_balls : DEFAULT_BALL_NUMS;

        this.owner = new Owner(_ws, _messageObj.auth);  // set owner  
        this.players = [];

        this.time_start = Date.now();
        this.intervalID = setInterval(() => this.update(), 1000);
        this.count = 0;

        this.pulledTiles = [-1];
        this.started = false;  // Track if game has started

        //this.gameStateChanged = true;
    }

    addPlayer(_name, _ws) {
        console.log(`\n=== addPlayer called ===`);
        console.log(`Player name: "${_name}" (type: ${typeof _name}, length: ${_name.length})`);
        console.log(`Current players in game ${this.string}:`);
        this.players.forEach((p, idx) => {
            console.log(`  [${idx}] name="${p.name}" (type: ${typeof p.name}, length: ${p.name.length}), id=${p.playerId}`);
        });

        // Normalize and trim the name for comparison
        const normalizedName = String(_name).trim();
        console.log(`Normalized name: "${normalizedName}"`);

        // Check if player with this name already exists (reconnecting)
        const existingPlayer = this.players.find(p => {
            const existingNormalized = String(p.name).trim();
            const matches = existingNormalized === normalizedName;
            console.log(`  Comparing "${existingNormalized}" === "${normalizedName}" -> ${matches}`);
            return matches;
        });

        if (existingPlayer) {
            // Player is reconnecting - update their websocket and return existing player
            console.log(`✓ RECONNECTION DETECTED: Player "${normalizedName}" already exists with ID ${existingPlayer.playerId}`);
            console.log(`  Updating WebSocket for existing player`);
            existingPlayer.ws = _ws;
            console.log(`  Returning existing player ID: ${existingPlayer.playerId}`);
            console.log(`=== addPlayer complete (reconnection) ===\n`);
            return existingPlayer.playerId;
        }

        // New player - create new player object with next available player ID
        const newPlayerId = this.players.length;
        console.log(`✓ NEW PLAYER: "${normalizedName}" will get ID ${newPlayerId}`);
        this.players.push(new Player(normalizedName, _ws, newPlayerId, this));
        console.log(`  Player added. Total players now: ${this.players.length}`);
        console.log(`  Players list:`, this.players.map(p => ({name: p.name, id: p.playerId})));
        console.log(`=== addPlayer complete (new player) ===\n`);
        return newPlayerId;
    }

    update() {
        //if (this.gameStateChanged) {
        this.owner.ws.send( JSON.stringify( { type: "game update", state: this.getGameState() } ) );
        //}
    }

    pullTile() {
        while (true) {
            let tile = getRandomInteger(1, this.options.num_balls);
            if (!this.pulledTiles.includes(tile)) {
                this.pulledTiles.push(tile);
                return tile;
            }
        }
    }

    getGameState() {
        return {
            players: this.players.map(p => ({
                name: p.name,
                id: p.playerId,
                card: p.card
            })),
            pulledTiles: this.pulledTiles,
            started: this.started
        };
    }

    getNumPlayersWithCard(tile) {

        let i = 0;

        this.players.forEach(player => {
            if (player.card.array.contains(tile)) {
                i++;
            }
        });

        return i;
    }
}

module.exports = { Tile, Card, Player, Owner, Game };
