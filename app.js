const express = require("express"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  User = require("./models/user"),
  LocalStrategy = require("passport-local"),
  //passportLocalMongoose = require("passport-local-mongoose"),
  port = 3000;



mongoose.connect('mongodb://localhost:27017/authApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to DB!')).catch(error => console.log(error.message));

const app = express();

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
//app.use(express.static("public"));

app.use(
  require("express-session")({
    secret: "Bear is the best and most purdy dog",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.get("/", (req, res) => {
    res.render("home")
})

app.get("/secret", isLoggedIn, (req, res) => {
    res.render("secret")
})

//Auth Routes

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", (req, res) => {
    req.body.username
    req.body.password
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if(err) {
            console.log(err)
            return res.render("register")
        } 
        passport.authenticate("local")(req, res, () => {
            res.redirect("/login")
        })  
    })
})

//Log In Routes

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", passport.authenticate("local", {  //This is an example of middleware
    successRedirect: "/secret",
    failureRedirect: "/login"
}), (req, res) => {

})

//Log Out Routes

app.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})

//Middlewear to ask if user is logged in before rendering the secret page

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
    return next();
    } 
    res.redirect("/login")
}

//Local Server
app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);