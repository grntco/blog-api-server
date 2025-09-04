export const handleGeneralErrors = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Server Error: Unable to process request.",
  });
};
