const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../db/userDB.js");

const auth = require("../middleware/auth");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const { ObjectId } = require("mongodb");

/* Register */
router.post("/register", async (req, res) => {
  console.log(">>>>> POST register", req.body);
  const { name, email, password } = req.body;

  // Simple validation
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ valid: false, msg: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      // res.status(400).json({ error: "User already exists" });
      throw Error("User already exists");
    }
    // if (user) throw Error("User already exists");

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error("Something went wrong with bcrypt");

    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error("Something went wrong hashing the password");

    // create new user
    await User.createOne({
      name: name,
      email: email,
      password: hash,
    });

    // find the saved user
    const savedUser = await User.findOne({ email: email });
    if (!savedUser) throw Error("Something went wrong saving the user");

    // create token
    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
      expiresIn: "30s",
    });

    // send back token and user info
    res.status(200).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/* Login */
router.post("/login", async function (req, res) {
  console.log(">>>>> POST /auth/login");
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    throw Error("Please enter all fields");
    // return res
    //   .status(400)
    //   .json({ valid: false, msg: "Please enter all fields" });
  }

  try {
    // Check for existing user
    const user = await User.findOne({ email: email });
    if (!user) throw Error("User does not exist");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error("Invalid credentials");

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    if (!token) throw Error("Couldn't sign the token");

    res.status(200).json({
      valid: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    res.status(400).json({ valid: false, msg: e.message });
  }
});

// @route GET auth/user
// @desc Get user date
// @access Private
router.get("/user", auth, async (req, res) => {
  console.log("[auth.js] GET /user");
  try {
    console.log("[auth.js] GET /user req.user:", req.user);
    console.log("GET /auth/user", req.user.id);
    const user = await User.getUserById({ _id: ObjectId(req.user.id) });
    if (!user) {
      throw Error("User does not exist");
      // res.status(400).json({ valid: false, msg: "User does not exist" });
    } else {
      delete user.password;
      res.status(200).send({ valid: true, user: user });
    }
  } catch (e) {
    res.status(400).send({ valid: false, msg: e.message });
  }
});

module.exports = router;
