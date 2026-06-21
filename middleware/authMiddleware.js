const protect = (req, res, next) => {
  const { user } = req.session;

  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "unauthorized",
    });
  }

  // Attach the user to the request object so controllers can access it if needed
  req.user = user;

  // Pass control to the next middleware or controller
  next();
};

module.exports = protect;
