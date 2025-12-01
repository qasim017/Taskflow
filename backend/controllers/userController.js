const User = require("../models/User");
const jwt = require("jsonwebtoken");

/////////////////////////////////////s
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "5d",
  });
};
////////////////////////////////////e

/////////////////////////////////////s
//login user
const loginUser = async (req, res) => {
  //destructure  email and password from request body
  const { email, password } = req.body;

  try {
    //call login method from user model
    const user = await User.login(email, password);
    //create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
/////////////////////////////////////e

/////////////////////////////////////s
//signup user
const signupUser = async (req, res) => {
  //destructure name, email and password from request body
  const { name, email, password } = req.body;

  try {
    const user = await User.signup(name, email, password);
    //create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
/////////////////////////////////////e

module.exports = { loginUser, signupUser };
