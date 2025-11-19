const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//static signup method
userSchema.statics.signup = async function (name, email, password) {
  //validation
  if (!name || !email || !password) {
    throw Error("All fields must be filled");
  }
  //check email validity
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  //check password strength
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  const exists = await this.findOne({ email });
  //check if email already exists
  if (exists) {
    throw Error("Email already in use");
  }
  //hashing password and salting(adding random strings to password before hash)
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  //create user
  const user = await this.create({ name, email, password: hash });
  return user;
};

//static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  //find user by email

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email");
  }
  //compare password with hashed password(using bcrypt.compare)
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  return user;
};

module.exports = mongoose.model("User", userSchema);
