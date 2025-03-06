import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const signup = async (req, res) => {
  try {
    // get all info from request body
    const { fullName, username, email, password } = req.body;
    // regex for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //is email valid or not according to the regex
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    // if username is already exists then return with error
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }
    // if email is already exists then return with error
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }
    // if passowrd is less than 6 character throw and retrun
    if(password.length < 6){
      return res.status(400).json({error:"Password must be at least 6 characters long"});
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //creating new user
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const login = async (req, res) => {
  res.json({
    data: "you hit the login endpoint",
  });
};
export const logout = async (req, res) => {
  res.json({
    data: "you hit the logout endpoint",
  });
};
