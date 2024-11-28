const jwt = require("jsonwebtoken");

module.exports.authMiddleware = async (req, res, next) => {
  // const { customerToken } = req.cookies;
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return res.status(409).json({ error: "Please login first" });
  } else {
    try {
      const deCodeToken = await jwt.verify(accessToken, process.env.SECRET);

      req.role = deCodeToken.role || "seller";
      req.id = deCodeToken.id;
      next();
    } catch (error) {
      return res.status(409).json({ error: "Please login" });
    }
  }
};
module.exports.customerMiddleware = async (req, res, next) => {
  const { customerToken, accessToken } = req.cookies;
  // const { accessToken } = req.cookies;

  if (!customerToken && !accessToken) {
    return res.status(409).json({ error: "Please login first" });
  } else {
    try {
      const deCodeToken = await jwt.verify(
        customerToken || accessToken,
        process.env.SECRET
      );

      // console.log("deCodeToken.......", deCodeToken);
      req.role = deCodeToken.role || "seller";
      req.user = deCodeToken;

      req.id = deCodeToken.id;
      next();
    } catch (error) {
      return res.status(409).json({ error: "Please login" });
    }
  }
};
