const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.Port || 5000;

// Middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s5rla.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try {
        await client.connect();
        console.log('Connected to database');

        const database = client.db('traveloTour');
        const tourPackCollection = database.collection('tourPackages');
        const orderCollection = database.collection('orders');

        // GET API
        app.get('/tourPackages', async(req,res) => {
            const cursor = tourPackCollection.find({});
            const tourPackages = await cursor.toArray();
            res.send(tourPackages);
        })

        // POST API
        app.post('/tourPackages',async(req,res) => {
            const tourPackage = req.body
            console.log('hit the post api',tourPackage);
            const result = await tourPackCollection.insertOne(tourPackage);
            console.log(result); 
            res.json(result);
        })

        // ADD ORDERS API
        app.post('/orders',async(req,res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

         // GET ORDERS API
         app.get('/orders', async(req,res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        // GET Single Order
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific order', id);
            const query = { _id: ObjectId(id) };
            const order = await orderCollection.findOne(query);
            res.json(order);
        })

        // DELETE ORDER API
        app.delete('/orders/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            console.log('Deleted',result);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/',(req,res) => {
    res.send('Running Travelo Server');
})

app.listen(port,() => {
    console.log('Server port', port);
})