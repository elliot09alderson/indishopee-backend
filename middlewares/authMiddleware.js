const jwt = require("jsonwebtoken");

module.exports.authMiddleware = async (req, res, next) => {
  // const { customerToken } = req.cookies;
  const auhthorizationHeader = req.headers.authorization;

  const { accessToken } = req.cookies;
  console.log(req.headers.authorization);
  if (!customerToken && !accessToken && !auhthorizationHeader) {
    return res.status(409).json({ error: "Please login first" });
  } else {
    try {
      const deCodeToken = await jwt.verify(accessToken, process.env.SECRET);

      req.role = deCodeToken.role || "seller";
      req.id = deCodeToken.id;
      next();
    } catch (error) {
      return res
        .status(409)
        .json({ error: "Please login", message: "login please ", status: 400 });
    }
  }
};
module.exports.customerMiddleware = async (req, res, next) => {
  const { customerToken, accessToken } = req.cookies;
  const auhthorizationHeader = req.headers.authorization;

  // const { accessToken } = req.cookies;

  if (!customerToken && !accessToken && !auhthorizationHeader) {
    return res.status(409).json({
      error: "Please login first",
      message: "login please ",
      status: 400,
    });
  } else {
    try {
      const deCodeToken = await jwt.verify(
        customerToken || accessToken || auhthorizationHeader,
        process.env.SECRET
      );
      console.log(deCodeToken);
      // console.log("deCodeToken.......", deCodeToken);
      req.role = deCodeToken.role || "seller";
      req.user = deCodeToken;

      req.id = deCodeToken.id;
      next();
    } catch (error) {
      return res
        .status(409)
        .json({ error: "Please login", message: "login please ", status: 400 });
    }
  }
};
