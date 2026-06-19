import Post from '../models/Post.js'
import Tag from '../models/Tag.js'

// Sigue siendo más o menos igual que el primer tp.

export const addTagToPost = async (req, res) => {
  try {
    const { id } = req.params; // El ID del post (viene en la URL)
    const { name } = req.body; // El nombre de la etiqueta (viene en el JSON)

    if (!name) {
      return res.status(400).json({ error: 'El nombre de la etiqueta es obligatorio' });
    }

    // 1. Verificamos que el post exista
    const post = await Post.findById(id); // .findByPK()
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    // 2. Buscamos la etiqueta, o la creamos si es la primera vez que se usa.
    let tag = await Tag.findOne({
       name: name.toLowerCase() 
    }); // Aca si o si utilizamos let porque si la etiqueta no existe, se crea una nueva y se guarda el nuevo valor en la variable. Se entiende?

    // Si no existe la etiqueta, la creamos
    if (!tag){
        tag = await Tag.create({
            name: name.toLowerCase()
        });
    }

    // Asociamos la etiqueta al post y evitamos repetidos.

    const tagExists = post.tags.some(
        tagId => tagId.toString() === tag._id.toString()
    );

    // Si la etiqueta ya existe:

    if(tagExists){
        return res.status(200).json({
            message: "La etiqueta ya estaba asociada al post", tag
        });
    }

    // Si no existe la etiqueta, se agrega al post

    post.tags.push(tag._id);

    await post.save();

    res.status(200).json({ message: 'Etiqueta vinculada con éxito al post', tag });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la etiqueta' });
  }
};