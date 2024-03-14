const setCookie = (token, res) => {
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 Days in milliseconds
    httpOnly: true, // Prevent XSS (Cross-Site Scripting) attacks
    sameSite: "strict", // Prevent CSRF (Cross Site Request Forgery) attacks
    secure: process.env.NODE_ENV !== "development",
  });
};

export default setCookie;
