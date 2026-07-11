const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
      ...req.params,
      ...req.query,
      ...req.body,
      file: req.file,
    });
    if (!result.success) {
      const err = new Error(result.error.issues[0].message);
      err.statusCode = 400;
      return next(err);
    }
    next();
  };
};

export default validate;
