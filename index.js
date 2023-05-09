const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
const cors = require("cors");
app.use(cors());
app.use(express.json());
console.log();
// lets code from here
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2cofc5d.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    //   let make the database name
    const chocolateDb = client.db("chocolateDb").collection("chocolates");
    // posting methods from here
    app.post("/chocolate", async (req, res) => {
      const newChocolate = req.body;
      const result = await chocolateDb.insertOne(newChocolate);
      res.send(result);
      console.log(result);
      //   console.log(newChocolate);
    });

    //   get data from db
    app.get("/chocolates", async (req, res) => {
      const chocolates = await chocolateDb.find().toArray();
      res.send(chocolates);
    });
    //   delete db from here
    app.delete("/chocolates/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await chocolateDb.deleteOne(query);
      res.send(result);
    });

    // get single  db from here
    app.get("/chocolates/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await chocolateDb.findOne(query);
      res.send(result);
    });
    app.put("/updateChocolate/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedData = {
        $set: {
          name: body.name,
          country: body.country,
          category: body.category,
          img: body.img,
        },
      };
      const result = await chocolateDb.updateOne(query, updatedData, options);
      res.send(result);
    });
    await client.db("admin").command({ ping: 1 });
    // Send a ping to confirm a successful connection
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("coltese bhai");
});

app.listen(port, () => {
  console.log("Running on port", port);
});
