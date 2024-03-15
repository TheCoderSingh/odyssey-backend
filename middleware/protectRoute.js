const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access Denied! No token provided." });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(401).json({ error: "Access Denied! Invalid token." });
    }

    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    console.log("Error authenticating user: ", error.message);
    return res.status(401).json({ error: "Access Denied!" });
  }
};

export default protectRoute;
