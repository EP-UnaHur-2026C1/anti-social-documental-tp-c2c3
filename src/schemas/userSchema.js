import Joi from 'joi';

// Esquema de validacion para crear un usuario.
export const createUserSchema = Joi.object({
  nickName: Joi.string().min(3).max(50).required().messages({
    'string.base': 'El nickName debe ser un texto.',
    'string.empty': 'El nickName no puede estar vacío.',
    'string.min': 'El nickName debe tener al menos 3 caracteres.',
    'string.max': 'El nickName no puede tener más de 50 caracteres.',
    'any.required': 'El nickName es obligatorio.'
  })
});

// Funcion generica para validar cualquier esquema de Joi en las rutas de Express
// Principio DRY (Don't Repeat Yourself) para evitar repetir el mismo código de validación en cada ruta
export const validateSchema = (schema) => {
  return (req, res, next) => {

    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({ errors: errorMessages });
    }
    
    next();
  };
};