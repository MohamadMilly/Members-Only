const express = require("express");
const path = require("path");
const pool = require("./db/pool");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const indexRouter = require("./routes/indexRoute");
const LocalStrategy = require("passport-local").Strategy;
const pgSession = require("connect-pg-simple")(session);

const bcrypt = require("bcryptjs");
const db = require("./db/queries");

require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 1000 * 60 * 60 * 24,
    },
  })
);
app.use(flash());
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUser(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = bcrypt.compareSync(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (error) {
      done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log("Your app is listening on port: ", PORT);
});
