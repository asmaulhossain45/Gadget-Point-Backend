const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.flnzb5m.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    // Create collection
    const brandCollection = client.db("GadgetDB").collection("Brand");
    const productCollection = client.db("GadgetDB").collection("products");
    const cartCollection = client.db("GadgetDB").collection("cart");

    // Get Brand Name in server site
    app.get("/api/brand", async (req, res) => {
      const result = await brandCollection.find().toArray();
      res.send(result);
    });

    // POST Products data to MongoDB from Client Site
    app.post("/api/products", async (req, res) => {
      const products = req.body;
      const result = await productCollection.insertOne(products);
      res.send(result);
    });

    // Get all Products data to Server site from MongoDB
    app.get("/api/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

    // ========= practice =========
    // Get all Products data by brand from MongoDB
    app.get("/api/brand/:brand", async (req, res) => {
      const brand = req.params.brand;
      console.log(brand);
      const query = { brand: brand };
      console.log(query);
      const result = await productCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });
    // ========= practice =========

    // Get one Products data to Server site from MongoDB
    app.get("/api/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    // Patch one product data
    app.patch("/api/products/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDetails = {
        $set: {
          name: updateData.name,
          brand: updateData.brand,
          category: updateData.category,
          released: updateData.released,
          photoURL: updateData.photoURL,
          price: updateData.price,
          rating: updateData.rating,
          description: updateData.description,
        },
      };
      const result = await productCollection.updateOne(filter, updateDetails);
      res.send(result);
    });

    // POST Cart data to MongoDB from Client Site
    app.post("/api/cart", async (req, res) => {
      const cart = req.body;
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    });

    // Get all cart data to Server site from MongoDB
    app.get("/api/cart", async (req, res) => {
      const result = await cartCollection.find().toArray();
      res.send(result);
    });

    // Get one cart Products to Server site from MongoDB
    app.get("/api/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      // console.log(query);
      const result = await cartCollection.findOne(query);
      res.send(result);
    });

    // Delete Cart Product Function
    app.delete("/api/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
