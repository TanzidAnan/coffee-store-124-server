const express = require('express');
const cors = require('cors');
const app =express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port =process.env.PORT || 5000

app.use(cors())
app.use(express.json())


// coffeeMaster
// bItTWJuWRBtoo62I




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e72gk.mongodb.net/?retryWrites=true&w=majority
`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e72gk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("coffeedb1").collection("coffee");

    app.get('/coffee',async(req,res) =>{
        const cursor = coffeeCollection.find();
        const result =await cursor.toArray();
        res.send(result) 
    })
    app.get('/coffee/:id',async(req,res) =>{
        const id =req.params.id;
        const queray ={_id:new ObjectId(id)}
        const result =await coffeeCollection.findOne(queray);
        res.send(result)
        
    })
    app.post('/coffee',async(req,res) =>{
        const coffees =req.body;
        console.log(coffees);
        const result =await coffeeCollection.insertOne(coffees)
        res.send(result)
    })
    app.put('/coffee/:id',async(req,res) =>{
        const id =req.params.id
        const filter = { _id:new ObjectId(id) };
        const options = { upsert: true };
        const updateCoffee =req.body
        const coffee ={
            $set:{
                name:updateCoffee.name,
                quentaty:updateCoffee.quentaty,
                supplier:updateCoffee.supplier,
                taste:updateCoffee.taste,
                category:updateCoffee.category,
                photo:updateCoffee.photo,
                details:updateCoffee.details
            }
        }
        const result =await coffeeCollection.updateOne(filter,coffee,options);
        res.send(result)
    })

    app.delete('/coffee/:id', async(req,res) =>{
        const id =req.params.id;
        const queray ={_id:new ObjectId(id)}
        const result =await coffeeCollection.deleteOne(queray);
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('coffee server running')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })