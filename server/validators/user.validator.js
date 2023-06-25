import Joi from "joi";

export function validateLoginUser(user) {
  const schemaOfLoginUser = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schemaOfLoginUser.validate(user);
}

export function validateRegisterUser(user) {
  const schemaOfUser = Joi.object({
    name: Joi.string().required().min(2).max(255),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schemaOfUser.validate(user);
}
