const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const port = 5000;

const uri =  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.esrkv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(express.json());
app.use(cors());


client.connect(err => {
  const blogCollection = client.db(process.env.DB_NAME).collection("blog");
  
  if(err){
    console.log("wrong")
  }else{
    console.log('database connected');

    app.get('/', (req, res) => {
      res.send('database connected')
    })

    app.get('/blogs', (req, res) => {
      blogCollection.find({})
      .toArray((err, blog) => {
        res.send(blog)
      })
    })

    app.post('/addBlog', (req, res) => {
      const blog = req.body;
      blogCollection.insertOne(blog)
          .then(result => {
              res.send(result.insertedCount > 0);
          })
    })

    app.get('/blog/:id', (req, res) =>{
      console.log(req.params.id);
      blogCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, blog) => {
        res.send(blog[0])
      })
    })

    app.delete('/deleteBlog/:id', (req, res) => {
      blogCollection.deleteOne({ _id: ObjectId(req.params.id) })
        .then(result => {
          res.send(result.deletedCount > 0)
        })
    })

  }


});

app.listen(process.env.PORT || port);