// Bueno, por lo que tengo entendido, Mongoose o MongoDB (no se cual de los dos, medio que me perdi ahí) actua igual que Sequelize, por lo tanto, podria copiar y pegar del tp anterior.

import User from '../models/User.js'

export const createUser = async (req, res) => {
  try {
    // Extraemos el nickName del cuerpo (body) de la petición
    const { nickName } = req.body;

    // Al implementar la validación con Joi, esta parte ya no es necesaria porque si el nickName no cumple con las reglas, 
    // la función validateSchema devolverá un error antes de llegar a este punto.
    /*if (!nickName) {
      return res.status(400).json({ error: 'El nickName es obligatorio' });
    }*/

    const newUser = await User.create({ nickName }); // Esta parte queda igual.
    
    // Devolvemos el usuario creado con código 201 (Created)
    res.status(201).json(newUser);

  } catch (error) {
    // Si el error es porque el usuario ya existe (violación de la restricción UNIQUE)
    if (error.code === 11000) {  // En MongoDB o Mongoose el error de clave es ekl 11000
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }
    
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Este dejo de ser .findAll();

    res.status(200).json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Error al obtener los usuarios'
    });
  }
};

export const getUserByNickName = async (req, res) => {
  try {
    const { nickName } = req.params;

    const user = await User.findOne({ nickName }); // Este dejo de ser .findByPK(nickName);

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Error al obtener el usuario'
    });
  }
};



export const deleteUser = async (req, res) => {
  try {
    const { nickName } = req.params;

    const user = await User.findOne({ nickName }); // findByPK(nickName)

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    await user.deleteOne();  // Este cambio de .destoy()

    res.status(200).json({
      message: 'Usuario eliminado correctamente'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Error al eliminar el usuario'
    });
  }
};