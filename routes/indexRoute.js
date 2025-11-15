const express = require("express");
const indexController = require("../controllers/indexController");
const validateSignUp = require("../middlewares/validatesignup");
const validateNewPost = require("../middlewares/validateNewPost");
const validateAdmin = require("../middlewares/validateAdmin");
const passport = require("passport");

const indexRouter = express.Router();

indexRouter.get("/", indexController.mainPostsGet);
indexRouter.get("/sign-up", indexController.signUpGet);
indexRouter.get("/log-in", indexController.logInGet);
indexRouter.get("/log-out", (req, res, next) => {
  req.logOut((error) => {
    if (error) {
      next(error);
    }
    res.redirect("/");
  });
});
indexRouter.get("/new-post", indexController.newPostGet);
indexRouter.get("/admin", indexController.administrationGet);

indexRouter.post("/new-post", validateNewPost, indexController.newPostPost);

indexRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureFlash: true,
  })
);
indexRouter.post("/sign-up", validateSignUp, indexController.signUpPost);
indexRouter.post("/admin", validateAdmin, indexController.administrationPost);
indexRouter.post("/delete/:postId", indexController.deletePost);
module.exports = indexRouter;
