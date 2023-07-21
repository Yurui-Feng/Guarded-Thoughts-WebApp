require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user._id,
      username: user.username,
      picture: user.picture,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

app.route("/").get((req, res) => {
  res.render("home");
});

app
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile"] }));

app
  .route("/auth/google/secrets")
  .get(
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/secrets");
    }
  );

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post(async (req, res) => {
    try {
      const user = new User({
        username: req.body.username,
        password: req.body.password,
      });
      req.login(user, (err) => {
        if (err) {
          console.log(err);
        } else {
          passport.authenticate("local", { failureRedirect: "/login" })(
            req,
            res,
            () => {
              res.redirect("/secrets");
            }
          );
        }
      });
    } catch (err) {
      console.log(err);
    }
  });

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(async (req, res) => {
    try {
      await User.register({ username: req.body.username }, req.body.password);
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets");
      });
    } catch (err) {
      console.log(err);
      res.redirect("/register");
    }
  });

app.route("/secrets").get(async (req, res) => {
  try {
    const allSecrets = await User.find({ secret: { $ne: null } });
    res.render("secrets", { userWithSecrets: allSecrets });
  } catch (err) {
    console.log(err);
  }
});

app
  .route("/submit")
  .get((req, res) => {
    if (req.isAuthenticated()) {
      res.render("submit");
    } else {
      res.redirect("/login");
    }
  })
  .post(async (req, res) => {
    try {
      const submittedSecret = req.body.secret;
      const foundUser = await User.findById(req.user.id);
      foundUser.secret = submittedSecret;
      await foundUser.save();
      res.redirect("/secrets");
    } catch (err) {
      console.log(err);
    }
  });

app.route("/logout").get((req, res) => {
  req.logout((err) => {
    console.log(err);
  });
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
