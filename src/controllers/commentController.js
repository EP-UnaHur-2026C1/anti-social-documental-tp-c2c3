import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

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