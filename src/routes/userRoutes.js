// Bueno como estamos migrando de una base de datos a otra, esto queda exactamente igual que el tp anterior.
// Como cambiamos de Sequelize a MongoDB/Mongoose, esto afecta más que nada a los modeloes y controladores, por lo que, las definiciones de endpoints, no requiere cambios.

import { Router } from 'express';
import { validateSchema, createUserSchema } from '../schemas/userSchema.js';
import { createUser,
    getAllUsers,
    getUserByNickName,
    updateUser,
    deleteUser
 } from '../controllers/userController.js';

const router = Router();

// CRUD de User
router.post('/', validateSchema(createUserSchema), createUser);
router.get('/', getAllUsers);
router.get('/:nickName', getUserByNickName);
router.put('/:nickName', updateUser)
router.delete('/:nickName', deleteUser);

export default router;