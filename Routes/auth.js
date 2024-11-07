const express = require("express");
const { Login, Signup, Logout } = require("../Controller/auth");
const auth = express.Router();

// Signup
auth.post("/signup", Signup);

// Login
auth.post("/login", Login);

// Logout
auth.get("/logout", Logout);

module.exports = auth;
