const WS_URL = "wss://poosdboard.com/ws/";

class BingoTile {
    constructor() {}
    public number: number = 0;
    public marked: boolean = false;
}

class BingoCard {
    constructor() {}
    public array: BingoTile[] = [];
}

class Players {
    constructor() {}
    public name: string = "";
    public id: number = 0;
    public card: BingoCard = new BingoCard();
}

class Game {
    constructor() {}
    public string: string = "";
    public players: Players[] = [];
    public pulledTiles: number[] = [];
}

class BingoWebsocket {

    public ws: WebSocket | null = null;

    public shouldReconnect: boolean = true;
    public reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    constructor() {}

    connect() {
        this.ws = new WebSocket(WS_URL);

        this.ws.onopen = () => {
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }
        };
        
        this.ws.onmessage = (event: { data: any }) => {
            const raw = event.data;
            const text = typeof raw === "string" ? raw : raw.toString();
            const data = JSON.parse(text);
            this.handleMessage(data);
        };

        this.ws.onclose = () => {
            if (this.shouldReconnect && !this.reconnectTimer) {
                this.reconnectTimer = setTimeout(() => this.connect(), 3000);
            }
        };

        this.ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            this.ws?.close();
        };
    }

    public handleMessage(_data: any) {
        // Handle incoming messages
    }

    public sendRaw(obj: any) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) throw new Error("Socket not open");
        this.ws.send(JSON.stringify(obj));
    }
}

// Websocket for the player
export class BingoWebsocketPlayer extends BingoWebsocket {

    public gameString: string;
    public playerName: string;
    public playerId: string | null = null;
    public board: BingoCard | null = null;
    public calledNumbers: number[] = [];
    public onCalledNumbersUpdate?: (numbers: number[]) => void;
    public onGameStart?: () => void;
    public onJoinSuccess?: () => void;
    public onError?: (error: string) => void;
    public onBingoSuccess?: () => void;
    public onGameEnded?: () => void;

    constructor(playerName: string, gameString: string) {
        super();

        this.playerName = playerName;
        this.gameString = gameString;

        this.connect();
    }

    connect(): void {
        super.connect();

        if (this.ws == null) 
            throw new Error("WebSocket not initialized");

        this.ws.onopen = () => {
            this.sendRaw({ type: "join game", playerName: this.playerName, string: this.gameString });
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }
        }
    }

    public handleMessage(data: any) {
        // Handle incoming messages specific to player

        switch (data.type) {
            case "join player success":
                this.board = data.board;
                this.playerId = data.playerId;
                
                // Update called numbers if provided (for reconnecting players)
                if (data.pulledTiles && data.pulledTiles.length > 0) {
                    this.calledNumbers = data.pulledTiles;
                    if (this.onCalledNumbersUpdate) {
                        this.onCalledNumbersUpdate(this.calledNumbers);
                    }
                }
                
                // Check if game has already started (server should send this info)
                if (data.gameStarted || data.started) {
                    // Trigger game start callback immediately
                    if (this.onGameStart) {
                        this.onGameStart();
                    }
                }
                
                // Also check if there are called numbers (indicates game in progress)
                if (data.calledNumbers && data.calledNumbers.length > 0) {
                    this.calledNumbers = data.calledNumbers;
                    if (this.onCalledNumbersUpdate) {
                        this.onCalledNumbersUpdate(this.calledNumbers);
                    }
                    // If we have called numbers but haven't triggered start, do it now
                    if (this.onGameStart && !data.gameStarted && !data.started) {
                        this.onGameStart();
                    }
                }
                
                if (this.onJoinSuccess) {
                    this.onJoinSuccess();
                }
                break;

            case "mark cell success":
                if(this.board) this.board.array[data.index].marked = true;
                break;

            case "mark cell fail":
                alert("Invlalid cell mark claim.");
                break;
        
            case "bingo check success":
                if (this.onBingoSuccess) {
                    this.onBingoSuccess();
                }
                break;

            case "bingo check fail":
                alert("Invlalid bingo claim." + data.error);
                break;
            
            case "game update":
                // Update called numbers from server (pulledTiles or state.pulledTiles)
                if (data.pulledTiles) {
                    this.calledNumbers = data.pulledTiles;
                } else if (data.state?.pulledTiles) {
                    this.calledNumbers = data.state.pulledTiles;
                }
                // Trigger UI update callback
                this.onCalledNumbersUpdate?.(this.calledNumbers);
                break;

            case "game start":
                // Game has started, trigger callback
                if (this.onGameStart) {
                    this.onGameStart();
                }
                break;

            case "error":
                // Handle error messages from server
                console.error("WebSocket error from server:", data.error);
                // Trigger error callback if defined
                if (this.onError) {
                    this.onError(data.error);
                }
                // Note: No default alert fallback - let the component handle it
                break;

            case "game ended":
                // Game has been ended by the host
                console.log("🛑 GAME ENDED MESSAGE RECEIVED:", data);
                console.log("🛑 Reason:", data.reason);
                console.log("🛑 onGameEnded callback exists?", !!this.onGameEnded);
                if (this.onGameEnded) {
                    console.log("🛑 Calling onGameEnded callback...");
                    this.onGameEnded();
                    console.log("🛑 onGameEnded callback completed");
                } else {
                    console.warn("🛑 No onGameEnded callback registered!");
                }
                break;

            default:
                break;
        }
    }

    // index of cell to mark
    public markCell(cellIndex: number) {
        this.sendRaw({ type: "mark cell", tileIndex: cellIndex });
    }

    // takes in a 5 array of numbers representing the tiles to check for bingo
    public checkBingo(array: number[]) {
        this.sendRaw({ type: "check bingo" , tiles: array});
    }

    // dont use this directly, use markCell and checkBingo instead
    //public sendPlayerAction(action: string, data: any) {
    //    this.sendRaw({ type: "player_action", playerId: this.playerId, action, data });
    //}
}

// Host version of the websocket
export class BingoWebsocketHost extends BingoWebsocket {

    public gameString: string = "";
    public game: Game = new Game();
    public hostName: string;
    public isReconnecting: boolean = false;

    public onPlayersUpdate?: (players: Players[]) => void;
    public onPulledTilesUpdate?: (tiles: number[]) => void;
    public onGameCreated?: (gameString: string) => void;
    public onGameStateUpdate?: (state: any) => void;
    public onWinner?: (winnerName: string) => void;

    constructor(name: string, existingGameString?: string) {
        super();

        this.hostName = name;
        
        // If we have an existing game string, we're reconnecting
        if (existingGameString) {
            this.gameString = existingGameString;
            this.isReconnecting = true;
        }

        this.connect();
    }

    connect(): void {
        super.connect();

        if (this.ws == null) 
            throw new Error("WebSocket not initialized");

        this.ws.onopen = () => {
            if (this.isReconnecting && this.gameString) {
                this.sendRaw({ type: "reconnect host", gameString: this.gameString, name: this.hostName });
            } else {
                this.sendRaw({ type: "new game", name: this.hostName });
            }
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }
        }
    }

    public handleMessage(data: any) {
        // Handle incoming messages specific to player

        switch (data.type) {
            case "new game success":
                this.gameString = data.gameString;
                // Trigger callback to update UI with the real game ID
                this.onGameCreated?.(data.gameString);
                break;

            case "reconnect host success":
                this.gameString = data.gameString;
                this.isReconnecting = false;
                
                // Restore game state from server
                if (data.state) {
                    this.game.players = data.state.players;
                    this.game.pulledTiles = data.state.pulledTiles;
                    
                    // Trigger all callbacks to update UI
                    this.onGameCreated?.(data.gameString);
                    this.onPlayersUpdate?.(this.game.players);
                    this.onPulledTilesUpdate?.(this.game.pulledTiles);
                    this.onGameStateUpdate?.(data.state);
                }
                break;

            case "game update":
                this.game.players = data.state.players;
                this.game.pulledTiles = data.state.pulledTiles;
                
                // Trigger UI update callbacks
                this.onPlayersUpdate?.(this.game.players);
                this.onPulledTilesUpdate?.(this.game.pulledTiles);
                this.onGameStateUpdate?.(data.state);
                break;

            case "player joined":
                // Handle when a new player joins
                if (data.state) {
                    this.game.players = data.state.players;
                    this.game.pulledTiles = data.state.pulledTiles || this.game.pulledTiles;
                    this.onPlayersUpdate?.(this.game.players);
                    this.onPulledTilesUpdate?.(this.game.pulledTiles);
                    
                    // If game has already started, notify through state update
                    if (data.state.started) {
                        this.onGameStateUpdate?.(data.state);
                    }
                } else if (data.player) {
                    // If server sends individual player, add them to the list
                    this.game.players.push(data.player);
                    this.onPlayersUpdate?.(this.game.players);
                }
                break;

            case "game finished":
                if (this.onWinner) {
                    this.onWinner(data.winnerName);
                }
                break;
        
            case "game new tile success":
                break;

            default:
                break;
        }
    }

    public PullTile() {
        this.sendRaw({ type: "game pull tile", gameString: this.gameString });
    }

    public StartGame() {
        this.sendRaw({ type: "game start", gameString: this.gameString });
    }

    public EndGame() {
        console.log("📡 EndGame() called - sending message to server");
        console.log("📡 Game string:", this.gameString);
        const message = { type: "end game", gameString: this.gameString };
        console.log("📡 Message to send:", message);
        this.sendRaw(message);
        console.log("📡 Message sent!");
    }
}