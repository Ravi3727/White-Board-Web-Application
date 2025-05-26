const { check, validationResult } = require('express-validator');


const validateUser = [
  check('email').isEmail().withMessage('Invalid email format'),
  check('password').isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
  }).withMessage('Password must be at least 6 characters long and include an uppercase letter and a lowercase letter'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateUser;
