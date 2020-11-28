const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fs= require('fs');
const fileUpload = require('express-fileupload');

const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://apartmentHome:apartmentHome123@cluster0.0rza7.mongodb.net/<apartmentRent>?retryWrites=true&w=majority";

const app = express()
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('order'));
app.use(fileUpload());



app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true,  connectTimeoutMS: 30000 ,  keepAlive: 1} );
client.connect(err => {
  const homecollection = client.db("apartmentRent").collection("apartmentRent");
  // perform actions on the collection object
  app.post('/addHome', (req, res) => {
        const file = req.files.file;
        const serviceTitle = req.body.serviceTitle;
        const location = req.body.location;
        const bathroom = req.body.bathroom;
        const price = req.body.price;
        const bedroom = req.body.bedroom;
        console.log(serviceTitle,location,bathroom,price,bedroom);
        const newImg = file.data;
    
        const encImg = newImg.toString('base64');
        
    
        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

    homecollection.insertOne({serviceTitle,location,bathroom,price,bedroom,image})
        .then(result => {
            res.send(result.insertedCount > 0)
        })
  
      })
      app.get('/renthome', (req, res) =>{
        homecollection.find({})
        .toArray((err,documents) =>{
        console.log(err)
        res.send(documents)
        })
        
        })
  //  My Rent
  app.get('/renthome', (req, res) =>{
    homecollection.find({email:req.query.email})
    .toArray((err,documents) =>{
    console.log(err)
    res.send(documents)
    })
    
    })
    
    
  // Booking list add of rent house and see list from booking
   const bookingList = client.db("apartmentRent").collection("bookingHome");
   app.post('/bookHome',(req,res) => {
    const adddata = req.body;
    console.log(adddata);
    bookingList.insertOne(adddata)
    .then(result=>{
      res.send("result")
        
    })
  })
  
  app.get('/booklistHome',(req,res) => {
     bookingList.find({})
     .toArray((err,documents) =>{
        res.send(documents)
     })
  })
});


app.listen(5000, () => console.log("Agency it service"));

