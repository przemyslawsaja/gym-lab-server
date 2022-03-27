import express from "express";
import passport from 'passport'
import auth from "../middleware/auth.js";

const CLIENT_URL = "http://localhost:4000/"
let router = express.Router();

router.get("/login/failed", (req, res ) => {
  res.status(401).json({
    success: false,
    message: "failure"
  })
})

router.get("/login/sucess", (req, res ) => {
  if(req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      cookies: req.cookies
      //or jwt
    })
  }

})

router.get("/google", passport.authenticate("google", { scope: ["profile"] }))
router.get("/google/callback", passport.authenticate("google", {
  successRedirect: CLIENT_URL,
  failureRedirect: "/login/failed"
}))

export default router
