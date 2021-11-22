const { MongoClient } = require("mongodb");
require("dotenv").config();

function UserDB() {
  const myDB = {};
  const DB_NAME = "myworldmap";
  const uri = process.env.MONGO_URI;

  myDB.findOne = async (query = {}) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    console.log("Connecting to the db");

    try {
      await client.connect();
      console.log("Connected");

      const col = client.db(DB_NAME).collection("Users");
      console.log("Collection ready, querying:", query);

      const user = await col.findOne(query);
      console.log("Found", user);

      return user;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  myDB.getUserById = async (query = {}) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    console.log("Connecting to the db");

    try {
      await client.connect();
      console.log("Connected");

      const col = client.db(DB_NAME).collection("Users");
      console.log("Collection ready, querying:", query);

      const user = await col.findOne(query, { _id: 1, name: 1, email: 1 });
      console.log("Found:", user);

      return user;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  myDB.createOne = async (user) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    // console.log("Connecting to the db");

    try {
      await client.connect();
      // console.log("Connected");

      const col = client.db(DB_NAME).collection("Users");
      // console.log("Collection ready, creating user:", user);

      const res = await col.insertOne(user);
      // console.log("Inserted", res);

      return res;
    } finally {
      // console.log("Closing the connection");
      client.close();
    }
  };

  return myDB;
}

module.exports = UserDB();
