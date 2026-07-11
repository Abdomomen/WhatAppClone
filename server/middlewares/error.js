function globalError(err, req, res, next) {
  console.error(err.message);

  // Handle JWT library errors specifically
  if (err.name === "TokenExpiredError") {
    return res
      .status(401)
      .json({ success: false, status: "fail", message: "Token has expired" });
  }
  if (err.name === "JsonWebTokenError") {
    return res
      .status(401)
      .json({ success: false, status: "fail", message: "Invalid token" });
  }

  const statusCode = err.statusCode || 500;
  const status =
    err.status || (statusCode >= 400 && statusCode < 500 ? "fail" : "error");

  res.status(statusCode).json({
    success: false,
    status,
    message: err.message || "Internal Server Error",
  });
}

export default globalError;
