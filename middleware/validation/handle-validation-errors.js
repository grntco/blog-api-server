import { matchedData, validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  const data = matchedData(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Failed validation",
      errors: errors.array(),
      formData: data,
    });
  }

  next();
};

export default handleValidationErrors;
