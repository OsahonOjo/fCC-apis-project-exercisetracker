require('dotenv').config({path: './sample.env'});
const cors = require('cors');
const express = require('express');
const urlParser = express.urlencoded({extended: true});
const app = express();

app.use(cors())
app.use(express.static('public'))

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  count: { type: Number, default: 0 }, 
  log: [{
    description: String,
    duration: Number,
    date: String
  }]
});

const User = mongoose.model('User', userSchema);

function logError(operation, err) {
  console.log(operation + " unsuccessful!");
  console.log(err);
}

/* create a new user */
app.post('/api/users', urlParser, function(req, res) {
  /* MUST verify user-controlled properties in the req.body */
  if (req.body.username) {    
    let newUser = new User({
      username: req.body.username,
      log: []
    });

    newUser.save()
           .then(function(document) {
             res.json({ 
               username: req.body.username, 
               _id: document._id
             });
           })
           .catch(function(err) {
             logError('create_user', err);
           });   
  }
});

/* create a new exercise for an existing user */
app.post('/api/users/:_id/exercises', urlParser, function(req, res) {
  /* verify user-controlled input */
  if (req.body.description && req.body.duration) {
    let date = req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString();
    
    User.findById(req.params._id)
        .then(document => {
          /* update returned document */
          document.log.push({
            description: req.body.description,
            duration: parseInt(req.body.duration),    /* duration is an integer */
            date: date
          });

          /* save update to database */
          document.save()
                  .then(document => {
                    let response = {
                      _id: document._id.toString(),
                      username: document.username,
                      date: date.toString(),
                      duration: parseInt(req.body.duration),
                      description: req.body.description
                    };
                    res.json(response);
                  })
                  .catch(err => {
                    logError('add_exercise', err);
                    res.send("Operation failed.");
                  });                   
        })
        .catch(err => {
          logError('add_exercise', err);
          res.send("Operation failed.");
        });
  }
});

/* GET all exercise data logs for a given user, 
 * with options for logs within a range of dates and limiting number of logs returned
 */
const getLogs = function(document, options) {
  let response = {
    username: document.username,
    _id: document._id.toString(),
    count: document.log.length,
    log: []
  };

  /* ensure correct data types */
  for (let i = 0; i < document.log.length; i++) {
    response.log.push({ 
      description: document.log[i].description,
      duration: parseInt(document.log[i].duration), 
      date: document.log[i].date.toString()
    });
  }

  if (options) {
    let fromString = new Date(options.from).toDateString();
    let toString = new Date(options.to).toDateString();
  
    /* convert date to milliseconds */
    let fromMS = Date.parse(fromString);    
    let toMS = Date.parse(toString);
  
    let limit = parseInt(options.limit);

    let tempLog = [...response.log];
    tempLog.filter(log => (Date.parse(log.date) >= fromMS && Date.parse(log.date) <= toMS));
    
    /* limit the number of responses */
    if (response.log.length > limit) {
      response.log.splice(limit);
      response.count = response.log.length;
    }
  }
  
  return response;
};

app.get('/api/users/:_id/logs', function(req, res) {
  const { from, to, limit } = req.query;
  
  if (req.params._id) {    
    User.findById(req.params._id)
        .then(document => {
          let response = getLogs(document, { from: from, to: to, limit: limit });
          res.json(response);
        })
        .catch(err => {
          logError('get_all_user_logs', err);
        });
  }
});

/* return a list of all users */
app.get('/api/users', function(req, res) {
  User.find({})    /* return all documents */
      .then(arrayofDocuments => {
        let response = [];
        for (let i = 0; i < arrayofDocuments.length; i++) {
          response.push({ _id: arrayofDocuments[i]._id, username: arrayofDocuments[i].username });
        }
        res.send(response);
      })
      .catch(err => {
        logError('get_all_users', err);
      });  
});

app.get('/mongo-health', function(req, res) {
  res.json({ status: mongoose.connection.readyState });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
