const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require(‘mongoose’),
      port = 3000

mongoose.connect('mongodb://localhost:27017/db_name', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to DB!')).catch(error => console.log(error.message));

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))



//Local Server
app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);