import Joi from "joi";

export function validateImage(image) {
  const schemaOfImage = Joi.object({
    imageName: Joi.string().required(),
  });

  return schemaOfImage.validate(image);
}
