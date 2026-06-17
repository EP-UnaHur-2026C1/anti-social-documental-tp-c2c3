import Joi from 'joi';

// postSchema.js
export const createPostSchema = Joi.object({
  description: Joi.string().min(1).max(280).required(), // limite de caracteres
  user_nickName: Joi.string().min(3).required(), // por ahora es necesario el nickName como id
  images: Joi.array().items(Joi.string().uri()).optional() // imagen opcional

  // TP anterior
});