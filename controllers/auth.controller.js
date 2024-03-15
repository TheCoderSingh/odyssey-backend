import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import hashPassword from "../utils/hashPassword.js";
import generateToken from "../utils/generateToken.js";
import setCookie from "../utils/setCookie.js";

export const signup = async (req, res) => {
  const {
    username,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    gender,
    profilePic,
  } = req.body;

  try {
    // Check if user data is valid
    if (
      await isUserValid(
        {
          username,
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          gender,
          profilePic,
        },
        res
      )
    ) {
      // Hash the password before saving to database
      const hashedPassword = await hashPassword(password);

      // Create a new user
      const newUser = new User({
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        gender,
        profilePic,
      });

      // TODO: Generate a JWT token
      const token = generateToken(newUser._id);

      setCookie(token, res);

      await newUser.save();

      res.status(201).json({ message: `${username} registered successfully.` });
    } else {
      throw new Error("User validation failed.");
    }
  } catch (error) {
    console.log("Error in registering user: ", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
};

const isUserValid = async (
  {
    username,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    gender,
    profilePic,
  },
  res
) => {
  // Check if username is already registered
  const existingUsername = await User.findOne({ username });

  if (existingUsername) {
    res.status(400).json({ error: "Username already exists." });
    return false;
  }

  // Check if first name is invalid
  if (!/^[a-z ,.'-]+$/i.test(firstName)) {
    res.status(400).json({ error: "Invalid first name." });
    return false;
  }

  // Check if last name is invalid
  if (!/^[a-z ,.'-]+$/i.test(lastName)) {
    res.status(400).json({ error: "Invalid last name." });
    return false;
  }

  // Check if email is already registered
  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    res.status(400).json({ error: "Email already exists." });
    return false;
  }

  // Check if passwords do not match
  if (password !== confirmPassword) {
    res.status(400).json({ error: "Passwords do not match." });
    return false;
  }

  // Check if gender is valid
  if (gender !== "male" && gender !== "female") {
    res.status(400).json({ error: "Invalid gender." });
    return false;
  }

  return true;
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordCorrect)
      return res.status(400).json({ error: "Invalid username or password." });

    const token = generateToken(user._id);
    setCookie(token, res);

    res.status(200).json({ message: `${username} logged in.` });
  } catch (error) {
    console.log("Error in logging in: ", error.message);
    res.status(400).json({ error: "An error occurred while logging in." });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.log("Error in logging out: ", error.message);
    res.status(400).json({ error: "An error occurred while logging out." });
  }
};
