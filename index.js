const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e8itm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(express.json());
app.use(cors());


client.connect(err => {
  const blogCollection = client.db("blogfield").collection("blog");

  app.get('/', (req, res) => {
    res.send('hello world')
  })
  
  app.post('/addBlog', (req, res) => {
    const blog = req.body;
    blogCollection.insertOne(blog)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
  })

  app.get('/blogs', (req, res) => {
    blogCollection.find({})
    .toArray((err, blog) => {
      res.send(blog)
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
})

;

app.listen(5000);