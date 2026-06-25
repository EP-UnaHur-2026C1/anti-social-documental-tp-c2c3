import Post from '../models/Post.js'
import Tag from '../models/Tag.js'

// Sigue siendo más o menos igual que el primer tp.

// AGREGAR TAG A POST
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

// CREAR ETIQUETA 
export const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: 'El nombre de la etiqueta es obligatorio' });

    // En MongoDB usamos el error 11000 para detectar duplicados (si 'name' es unique en el modelo)
    const newTag = await Tag.create({ name: name.toLowerCase() });
    
    res.status(201).json(newTag);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'La etiqueta ya existe' });
    }
    console.error(error);
    res.status(500).json({ error: 'Error al crear la etiqueta' });
  }
};

// OBTENER TODAS LAS ETIQUETAS
export const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find(); // Equivalente al SELECT * FROM Tags
    res.status(200).json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las etiquetas' });
  }
};

// ACTUALIZAR ETIQUETA
export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: 'El nuevo nombre es obligatorio' });

    // Actualizamos y pedimos que devuelva el documento nuevo
    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      { $set: { name: name.toLowerCase() } },
      { new: true }
    );

    if (!updatedTag) return res.status(404).json({ error: 'Etiqueta no encontrada' });

    res.status(200).json(updatedTag);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Ya existe otra etiqueta con ese nombre' });
    }
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la etiqueta' });
  }
};

// ELIMINAR ETIQUETA
export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTag = await Tag.findByIdAndDelete(id);

    if (!deletedTag) return res.status(404).json({ error: 'Etiqueta no encontrada' });

    res.status(200).json({ message: 'Etiqueta eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la etiqueta' });
  }
};