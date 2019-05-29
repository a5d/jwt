const express = require('express');
const swaggerUi = require('swagger-ui-express');
const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const MongoClient = require('mongodb').MongoClient

// Constants
const PORT = 3000
const HOST = '0.0.0.0'
const privateKey = 'shhhhh'

const mongoClient = new MongoClient('mongodb://mongodb:27017/', {useNewUrlParser: true})

const swaggerDocument = require('./swagger.json');

// App
const app = express()
let collection = null;

mongoClient.connect(function (err, client) {
  if (err) return console.log(err)
  collection = client.db('jwt').collection('users')
})

const jsonParser = bodyParser.json()
app.use(cookieParser())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/api/signup', jsonParser, (req, res) => {
  const user = req.body

  collection.find({email: user.email}).limit(1).toArray(function (err, users) {
    if (users.length > 0) {
      res.status(404).json({error: 'Email already use'})
    } else {
      collection.insertOne(user, function (err, result) {
        if (err) {
          res.status(404).json({error: 'Insert Error'})
        } else {
          res.json({msg: 'Registered'})
        }
      })
    }
  })
})

app.post('/api/login', jsonParser, (req, res) => {
  collection.find(req.body).limit(1).toArray(function (err, users) {
    if (users.length > 0) {
      console.log('user', users[0])
      const token = jwt.sign(users[0], privateKey)
      res.cookie('jwt', token, {expires: new Date(Date.now() + 900000), path: '/'})
      res.json({msg: 'Logged'})
    } else {
      res.status(404).json({error: 'Not found'})
    }
  })
})

app.post('/api/logout', (req, res) => {
  res.cookie('jwt', -1, {expires: new Date(Date.now() - 900000), path: '/'})
  res.json({msg: 'Logout'})
})

app.get('/api/profile', (req, res) => {
  try {
    const token = req.cookies.jwt
    const user = jwt.verify(token, privateKey)

    collection.find({email: user.email, password: user.password}).limit(1).toArray(function (err, users) {
      if (users.length > 0) {
        const userData = users[0]
        res.json({profile: {id: userData._id, email: userData.email}})
      } else {
        res.status(404).json({error: 'Error'})
      }
    })
  } catch (err) {
    res.status(404).json({error: err.message})
  }
})

app.all('*', function(req, res){
  res.send('not found', 404);
});

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
