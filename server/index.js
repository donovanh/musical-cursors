const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);
const { authorize } = require("@liveblocks/node");
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.post("/auth", (req, res) => {
  authorize({
    room: req.body.room,
    secret: process.env.LIVEBLOCKS_SECRET_KEY,
  })
    .then((authResponse) => {
      res.send(authResponse.body);
    })
    .catch((err) => {
      console.log({ err });
      res.status(403).end();
    });
});

/* Game logic */
// TODO: Separate out and test
const generateNewGameMap = () => ({
  status: "started",
  tiles: {
    0: true,
    1: true,
    2: true,
    3: true,
  },
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function listRemainingTiles(tiles) {
  return Object.entries(tiles).reduce((acc, t) => {
    if (t[1]) {
      acc.push(t[0]);
    }
    return acc;
  }, []);
}

const roundTime = 4 * 1000; // 4 seconds per round

async function runGame() {
  gameState = generateNewGameMap();
  sendGameState(gameState);
  for (let i = 0; i < 3; i++) {
    // TODO generate unix timestamp of next tile update for client
    await sleep(roundTime);
    const remainingTiles = listRemainingTiles(gameState.tiles);
    const tileToRemove = Math.floor(Math.random() * remainingTiles.length);
    gameState.tiles[remainingTiles[tileToRemove]] = false;
    sendGameState(gameState);
  }
  gameState.status = "finished";
  sendGameState(gameState);
}

function sendGameState(gameState) {
  expressWs
    .getWss()
    .clients.forEach((client) => client.send(JSON.stringify(gameState)));
}

let gameState = {};

app.ws("/", function (ws, req) {
  ws.on("message", (message) => {
    if (`${message}` === "start") {
      // Run a new game
      runGame();
    }
  });
  ws.send(JSON.stringify(gameState));
});

app.listen(8080);
