const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/boggleNew', {
  useNewUrlParser: true
});


// Create a scheme for products in the museum: a title and a path to an image.
const saveSchema = new mongoose.Schema({
  name: String,
  board: [
    [{
      type: String
    }]
  ],
  score: String
});
// Create a model for products in the museum.
const Save = mongoose.model('Save', saveSchema);

// Create a new save in the leaderboard: takes a title and a path to an image.
app.post('/api/save', async (req, res) => {
  const save = new Save({
    name: req.body.name,
    board: req.body.board,
    score: req.body.score
  });
  try {
    await save.save();
    res.send(save);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


// Delete a product
app.delete('/api/saves/:id', async (req, res) => {
  var id = req.params.id;
  console.log("Save:");
  console.log(Save);
  console.log("ID:");
  console.log(id);
  try{
    var result = await Save.deleteOne({_id:id});
    console.log("Result:");
    console.log(result);
    res.sendStatus(200);
  } catch (error){
    console.log(error);
    res.sendStatus(500);
  }
});


// Edit a product
app.put('/api/saves/:id', async (req, res) => {
  var id = req.params.id;
  console.log("Save:");
  console.log(Save);
  console.log("ID:");
  console.log(id);
  try{
    var save = await Save.findOne({_id:id});
    save.title = req.body.title;
    save.save();
    res.sendStatus(200);
  } catch (error){
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the products in the museum.
app.get('/api/saves', async (req, res) => {
  try {
    let saves = await Save.find();
    res.send(saves);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});



app.listen(8080, () => console.log('Server listening on port 8080!'));