import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

// CREAR COMENTARIO
export const createComment = async (req, res) => {
  try {
    const { id } = req.params; // Obtenemos el ID del post desde la URL
    const { text, user_nickName } = req.body;

    if (!text || !user_nickName) {
      return res.status(400).json({ error: 'El texto y el autor son obligatorios' });
    }

    // Verificamos que el post exista antes de comentarlo
    const post = await Post.findById(id); // .findByPK()
    if (!post) {
      return res.status(404).json({ error: 'El post que intentas comentar no existe' });
    }

    // Verificamos que exista el usuario

    const user = await User.findOne({
        nickName: user_nickName
    });

  // Se evita comentarios de usuarios que no existen

    if(!user){
        return res.status(404).json({
            error: 'El usuario especificado no existe'
        });
    }
   
    const newComment = await Comment.create({
      text,
      user_nickName,
      post_id: id
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el comentario" });
  }
};

// OBTENER COMENTARIOS POR POST
export const getCommentsByPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if(!post){
      return res.status(404).json({
        error: "Post no encontrado"
      })
    }

    const comments = await Comment.find({
      post_id: id
    }).sort({ createdAt: -1 });

    res.status(200).json(comments);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener comentarios"
    });
  }
};

// ACTUALIZAR COMENTARIO
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params; // El ID del comentario a modificar
    const { text } = req.body; // El nuevo texto que envía el usuario

    if (!text) {
      return res.status(400).json({ error: 'El texto del comentario es obligatorio' });
    }

    // Buscamos el comentario por ID y actualizamos su campo 'text'
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { $set: { text } },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el comentario' });
  }
};

// ELIMINAR COMENTARIO
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        error: "Comentario no encontrado"
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      message: "Comentario eliminado correctamente"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al eliminar comentario"
    });
  }
};