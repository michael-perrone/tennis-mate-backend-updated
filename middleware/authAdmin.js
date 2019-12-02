const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "Not authorized" });
  }

  try {
    const decodedToken = jwt.verify(token, config.get("adminSecret"));
    req.admin = decodedToken.admin;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Also not authorized" });
  }
};
