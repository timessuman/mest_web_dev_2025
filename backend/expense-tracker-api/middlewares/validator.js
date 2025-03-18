import Joi from 'joi'

export const requestValidator = (
  req,
  res,
  next
) => {
  if (req.url.includes('/users/signup') && req.method === 'POST') {
    const userValidator = Joi.object({
      name: Joi.string().required()
        .messages({
          "any.required": "Name is required"
        }),
      email: Joi.string().email().required()
        .messages({
          "any.required": "Email is required"
        }),
      password: Joi
        .string()
        .min(6)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$"))
        .required()
        .messages({
          "string.min": "Password must be at least 6 characters long",
          "string.pattern.base": "Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character",
          "any.required": "Password is required",
        }),
    });
    const { error, value } = userValidator.validate(req.body, { abortEarly: false});
    if (error) {
      return res.status(422).json(error);
    }

    req.body = value;
    return next();
  }

  if (req.url.includes('/users/change-password') && req.method === 'PATCH') {
    const changePasswordValidator = Joi.object({
      currentPassword: Joi.string().required()
       .messages({
          "any.required": "Current password is required",
        }),
      newPassword: Joi
       .string()
       .min(6)
       .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$"))
       .required()
       .messages({
          "string.min": "Password must be at least 6 characters long",
          "string.pattern.base": "Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character",
          "any.required": "New password is required",
        }),
      confirmPassword: Joi.string()
       .required()
       .valid(Joi.ref('newPassword'))
    })
    .with('newPassword', 'confirmPassword');

    const { error, value } = changePasswordValidator.validate(req.body,
      { abortEarly: false}
    );
    if (error) {
      return res.status(422).json(error);
    }
    req.value = value;
    // return next();
  }

  if (req.url.includes('/login') && req.method === 'POST') {
    const loginValidator = Joi.object({
      email: Joi.string().email().required()
        .messages({
          "any.required": "Email is required"
        }),
      password: Joi
        .string()
        .required()
        .messages({
          "any.required": "Password is required",
        }),
    });
    const { error, value } = loginValidator.validate(req.body, { abortEarly: false});
    if (error) {
      return res.status(422).json(error);
    }
    req.body = value;
    // next();
  }

  if (req.url.includes('/expenses') && req.method === 'POST') {
    const expenseValidator = Joi.object({
      amount: Joi.number().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      date: Joi.date().required(),
      isIncome: Joi.boolean().default(false),
      paymentMethod: Joi.string(),
      notes: Joi.string().optional(),
    });

    const { error, value } = expenseValidator.validate(req.body, { abortEarly: false});
    if (error) {
      return res.status(422).json(error);
    }

    req.value = value;
    // next();
  }

  next();
}