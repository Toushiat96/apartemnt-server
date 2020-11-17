const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://<apartmentHome>:<apartmentHome123>@cluster0.0rza7.mongodb.net/<apartmentRent>?retryWrites=true&w=majority";

const app = express()
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 5000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true,  connectTimeoutMS: 30000 ,  keepAlive: 1} );
client.connect(err => {
  const homecollection = client.db("apartmentRent").collection("apartmentRent");
  // perform actions on the collection object
  app.post('/addHome', (req, res) => {
        const serviceTitle = req.body.serviceTitle;
        const location = req.body.location;
        const bathroom = req.body.bathroom;
        const price = req.body.price;
        const bedroom = req.body.bedroom;
        console.log(serviceTitle,location,bathroom,price,bedroom);

    homecollection.insertOne({serviceTitle,location,bathroom,price,bedroom})
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

