import User from "../models/user.model.js";

const signup = async (req, res) => {
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
      // TODO: Hash the password before saving to database

      // Create a new user
      const newUser = new User({
        username,
        firstName,
        lastName,
        email,
        password,
        gender,
        profilePic,
      });

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

export default signup;

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
