function globalError(err, req, res, next) {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode;
  error.status = err.status;

  console.error(error.message);

  if (err.message === "TokenExpired") {
    error.message = "Token Expired";
    error.statusCode = 401;
    error.status = "fail";
  }
  if (err.message === "Invalid Token") {
    error.message = "Invalid Token";
    error.statusCode = 401;
    error.status = "fail";
  }
  if (err.message === "Token not found") {
    error.message = "Token not found";
    error.statusCode = 401;
    error.status = "fail";
  }
  if (err.message === "Token not found") {
    error.message = "Token not found";
    error.statusCode = 401;
    error.status = "fail";
  }

  const statusCode = error.statusCode || 500;
  const status = error.status || "error";

  res.status(statusCode).json({
    status: status,
    message: error.message || "Internal Server Error",
  });
}

export default globalError;
