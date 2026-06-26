import redisClient from '../config/redis.js';
import  Post  from '../models/Post.js';
import  User  from '../models/User.js';
import  Comment  from '../models/Comment.js';
import  Tag  from '../models/Tag.js';
// En Mongo no tenemos un modelo centrar como index.js, por eso se importa individualmente cada modelo

export const createPost = async (req, res) => {
  try {
    const { description, user_nickName, images } = req.body;

    // 1. Validación de campos obligatorios
    if (!description || !user_nickName) {
      return res.status(400).json({ error: 'La descripción y el autor (user_nickName) son obligatorios' });
    }

    // 2. Verificar que el usuario realmente exista en la base de datos
    const user = await User.findOne({ nickName: user_nickName}); // .findByPK()
    if (!user) {
      return res.status(404).json({ error: 'El usuario especificado no existe' });
    }

    // 3. Crear el post principal
    const newPost = await Post.create({
      description,
      user_nickName,
      images: images || []
    });

    /*

     Toda esta parte es innecesaria para Mongo porque no existe PostImage.

    // 4. Si el usuario envió imágenes, las asociamos al post
    // Usamos bulkCreate para insertar varias filas a la vez en la tabla Post_Images
    if (images && Array.isArray(images) && images.length > 0) {
      const imageRecords = images.map(url => ({
        url,
        post_id: newPost.id
      }));
      await PostImage.bulkCreate(imageRecords);
    }

    // 5. Buscamos el post recién creado para devolverlo completo (incluyendo sus imágenes)
    const postWithImages = await Post.findByPk(newPost.id, {
      include: [PostImage] // Esto hace un JOIN automático con Sequelize
    });
    */
   // Borramos la caché para forzar a que el próximo GET busque datos frescos
    await redisClient.del('all_posts');

    res.status(201).json(newPost);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor al crear el post' });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    //Intentamos obtener los post desde caché
    const cachedPosts = await redisClient.get('all_posts');
    
    if (cachedPosts) {
      console.log("Servido desde Redis");
      // Los datos en Redis son strings puros, debemos convertirlos a JSON
      return res.status(200).json(JSON.parse(cachedPosts));
    }
    // Si llegamos aquí, la caché estaba vacía
    console.log("Servido desde MongoDB ");
    // Obtener fecha desde .env
    const maxMonths = parseInt(process.env.COMMENT_MAX_AGE_MONTHS) || 6;
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - maxMonths);

    // Buscamos los posts
    // .lean() convierte los documentos de Mongoose a objetos JS puros
    // permite mutarlos (agregar comments) sin usar _doc.
    const posts = await Post.find().populate('tags').sort({ createdAt: -1 }).lean();

    // Recorremos cada post y buscamos sus comentarios filtrados
    for (const post of posts) { 
      const comments = await Comment.find({
        post_id: post._id,
        createdAt: { $gte: cutoffDate } //trae SOLO los más nuevos que la fecha de corte
      });

      post.comments = comments; 
    }
    //Guardar en caché
    await redisClient.setEx('all_posts', 3600, JSON.stringify(posts));
    res.status(200).json(posts);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las publicaciones' });
  }
};

// ACTUALIZAR POST
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body; 

    if (!description) {
      return res.status(400).json({ error: 'La nueva descripción es obligatoria' });
    }

    // findByIdAndUpdate busca y actualiza. 
    // { new: true } devuelve el documento actualizado en lugar del anterior
    const updatedPost = await Post.findByIdAndUpdate(
      id, 
      { $set: { description } }, // $set indica qué campos se deben modificar
      { new: true } 
    );

    if (!updatedPost) return res.status(404).json({ error: 'Post no encontrado' });
    // Borramos la caché para forzar a que el próximo GET busque datos frescos
    await redisClient.del('all_posts');
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el post' });
  }
};

// ELIMINAR POST
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params; 

    const post = await Post.findById(id); // antes era .findByPK()

    if (!post) {
      return res.status(404).json({ error: 'El post que intentas eliminar no existe' });
    }

    // 2. Eliminamos el registro de la base de datos
    await post.deleteOne();  // .destoy()
    
    await redisClient.del('all_posts');
    res.status(200).json({ message: 'Publicación eliminada correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar el post' });
  }
};

// AGREGAR IMAGEN A UN POST EXISTENTE
export const addImageToPost = async (req, res) => {
  try {
    const { id } = req.params; 
    const { url } = req.body;

    if (!url) return res.status(400).json({ error: 'La URL es obligatoria' });

    // findByIdAndUpdate busca el post y lo actualiza
    // $push inyecta el valor en el array 'images'
    // { new: true } nos devuelve el documento ya actualizado
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $push: { images: url } },
      { new: true }
    );

    if (!updatedPost) return res.status(404).json({ error: 'Post no encontrado' });
    await redisClient.del('all_posts');
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar imagen' });
  }
};

// ELIMINAR IMAGEN DE UN POST EXISTENTE
export const deleteImageFromPost = async (req, res) => {
  try {
    const { id } = req.params; 
    const { url } = req.body; 

    if (!url) return res.status(400).json({ error: 'La URL a eliminar es obligatoria' });

    // $pull busca en el array 'images' y remueve el string exacto que coincida con 'url'
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $pull: { images: url } },
      { new: true }
    );

    if (!updatedPost) return res.status(404).json({ error: 'Post no encontrado' });
    await redisClient.del('all_posts');
    res.status(200).json({ message: 'Imagen eliminada', post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar imagen' });
  }
};
//CARGAR IMAGEN DE UN POST EN UNA CARPETA
export const uploadImageToPost = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });

    // Armamos la URL local simulada
    const localUrl = `http://localhost:3000/uploads/${req.file.filename}`;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $push: { images: localUrl } },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la imagen' });
  }
};