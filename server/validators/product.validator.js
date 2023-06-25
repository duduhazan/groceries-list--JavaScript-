import Joi from "joi";

export default function validateProduct(product) {
  const schemaOfProduct = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().greater(0.0).required(),
    category: Joi.string().required(),
    imageName: Joi.string().required(),
  });

  return schemaOfProduct.validate(product);
}
