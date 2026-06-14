// Bueno como estamos migrando de una base de datos a otra, esto queda exactamente igual que el tp anterior.
// Como cambiamos de Sequelize a MongoDB/Mongoose, esto afecta más que nada a los modeloes y controladores, por lo que, las definiciones de endpoints, no requiere cambios.

import { Router } from 'express';
import { createUser,
    getAllUsers,
    getUserByNickName,
    deleteUser
 } from '../controllers/userController.js';
//import { validateSchema, createUserSchema } from '../schemas/userSchema.js';

const router = Router();

//router.post('/', validateSchema(createUserSchema), createUser);
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:nickName', getUserByNickName);
router.delete('/:nickName', deleteUser);

export default router;