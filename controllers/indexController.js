const db = require("../db/queries");
const { validationResult, matchedData } = require("express-validator");

const signUpGet = (req, res) => {
  res.render("sign-up");
};

const logInGet = (req, res) => {
  res.render("log-in", { errors: req.flash("error") });
};

const newPostGet = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.render("notAuthenticatedPage");
  } else {
    return res.render("new-post");
  }
};

const mainPostsGet = async (req, res) => {
  if (req.isAuthenticated()) {
    const postsWithAuthors = await db.getPosts(true);
    res.render("main", { posts: postsWithAuthors, user: req.user });
  } else {
    const postsWithoutAuthors = await db.getPosts(false);
    res.render("main", { posts: postsWithoutAuthors });
  }
};

const signUpPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("sign-up", { errors: errors.array() });
  }
  const { firstname, lastname, username, password } = matchedData(req);
  try {
    await db.addUser(firstname, lastname, username, password);
    res.redirect("/log-in");
  } catch (error) {
    return next(error);
  }
};

const newPostPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("new-post", { errors: errors.array() });
  }
  const { title, content, isAnonymous } = matchedData(req);
  const author_id = req.user.id;
  await db.addPost(title, content, !isAnonymous && author_id);
  res.redirect("/");
};

module.exports = {
  signUpGet,
  logInGet,
  newPostGet,
  mainPostsGet,
  signUpPost,
  newPostPost,
};
