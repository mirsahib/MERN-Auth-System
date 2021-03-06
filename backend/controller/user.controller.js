const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Field missing" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password doesn't match" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        userName: user.userName,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const userRegistration = async (req, res) => {
  try {
    let { email, password, passwordCheck, userName } = req.body;
    if (!email || !password || !passwordCheck || !userName) {
      return res.status(400).json({ msg: "Field missing" });
    } else if (password.length < 5) {
      return res.status(400).json({ msg: "Minimum password length is 5" });
    } else {
      if (password != passwordCheck) {
        return res.status(400).json({ msg: "Password is not matching" });
      }
    }
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ msg: "Email already exist" });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      userName,
    });
    const saveUser = await newUser.save();
    res.json({ msg: "User saved successfully", saveUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const isTokenValid = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.json(false);
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.json(false);
    }
    const user = await User.findById(verified.id);
    if (!user) {
      res.json(false);
    }
    return res.json(true);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getUserId = async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    userName: user.userName,
    id: user._id,
  });
};

module.exports = {
  userLogin,
  userRegistration,
  isTokenValid,
  getUserId,
};
