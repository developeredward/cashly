const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

let client;
let db;
let userSummaryCollection;

const connectToMongo = async () => {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("cashly");
    userSummaryCollection = db.collection("userSummary");
  }
};

const watchUserSummary = async (wss) => {
  await connectToMongo();

  const changeStream = userSummaryCollection.watch();

  changeStream.on("change", (change) => {
    console.log("User Summary Updated:", change);

    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        // WebSocket OPEN state
        client.send(
          JSON.stringify({ type: "userSummaryUpdate", data: change })
        );
      }
    });
  });
};

module.exports = { watchUserSummary };
