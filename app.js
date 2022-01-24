const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

//for magick bytes
const readChunk = require('read-chunk');
const imageType = require('image-type');

// middleware multer
const upload = require('./upload');

// JsonSchema
const Validator = require('jsonschema').Validator;
const v = new Validator();
const schema = require('./shemaHeroStats.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// default hero 
let hero = {
  "name": "Batman",
  "strength": 1,
  "dexterity": 4,
  "intellect": 2,
  "isInvincible": true
}

//setHeroStats
app.post('/setHeroStats', (req, res) => {
  const jsonValid = v.validate(req.body, schema); // validate json-schema
  jsonValid.valid
    ? (hero = req.body, res.status(200).json({ status: "Hero saved" }))
    : res.status(400).json({ status: "Bad Request" })
})

//getHeroStats
app.get('/getHeroStats', (req, res) => {
  res.json(hero)
})

//uploadHeroImage
const uploadSingleImage = upload.single('image');

app.post('/uploadHeroImage', (req, res) => {
  uploadSingleImage(req, res, (err) => {

    if (err) {
      return res.status(400).send({ status: err.message })
    }
    res.status(200).json({ status: 'Image upload' });
  })
})

//getHeroImage
app.get('/getHeroImage', (req, res) => {
  let pathImg = path.join(__dirname, '/img/hero')

  if (fs.existsSync(pathImg)) {
    const buffer = readChunk.sync((pathImg), 0, 12); // mime type
    res.type(imageType(buffer).mime)
    res.sendFile(pathImg)
  } else {
    res.json({ status: 'Image not found' })
  }
})

app.listen(3000, () => { console.log('Server started') });
