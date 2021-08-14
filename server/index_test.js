const express = require("express");
const { authorize } = require("@liveblocks/node");

const app = express();
app.use(express.json());

app.post("/auth", (req, res) => {
  authorize({
    room: req.body.room,
    secret: process.env.LIVEBLOCKS_SECRET_KEY,
  })
    .then((authResponse) => {
      console.log("Sending: ", authResponse);
      res.send(authResponse.body);
    })
    .catch((err) => {
      console.log({ err });
      res.status(403).end();
    });
});

app.listen(8080);
