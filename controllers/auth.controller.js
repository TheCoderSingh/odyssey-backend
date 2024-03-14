import User from "../models/user.model.js";

const signup = async (req, res) => {
  const { username, firstName, lastName, email, password, gender, profilePic } =
    req.body;

  try {
    if (
      await isUserValid(
        {
          username,
          firstName,
          lastName,
          email,
          password,
          gender,
          profilePic,
        },
        res
      )
    ) {
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
  { username, firstName, lastName, email, password, gender, profilePic },
  res
) => {
  // Check if username is already registered
  const existingUsername = await User.findOne({ username });

  if (existingUsername) {
    res.status(400).json({ error: "Username already exists." });
    return false;
  }

  // Check if email is already registered
  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    res.status(400).json({ error: "Email already exists." });
    return false;
  }

  return true;
};
