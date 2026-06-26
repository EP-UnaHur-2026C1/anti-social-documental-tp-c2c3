import { Router } from 'express';

import {
    createPost,
    getAllPosts,
    deletePost,
    updatePost,
    addImageToPost,
    deleteImageFromPost
} from '../controllers/postController.js';
import { validateSchema } from '../schemas/userSchema.js';
import { createPostSchema} from '../schemas/postSchema.js';
import { addTagToPost } from '../controllers/tagController.js';
import {
    getAllComments, 
    getCommentById, 
    createComment, 
    getCommentsByPost, 
    deleteComment, 
    updateComment 
} from '../controllers/commentController.js';

const router = Router();

// RUTAS ESTÁTICAS Y ESPECÍFICAS (Van primero)
// CRUD de Comentarios
router.get('/comments', getAllComments);
router.get('/comments/:id', getCommentById);
router.put('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);

// RUTAS GENERALES DE POSTS
router.post('/', validateSchema(createPostSchema), createPost);
router.get('/', getAllPosts);

// RUTAS CON COMODÍN /:id 
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

// Relaciones: Tags 
router.post('/:id/tags', addTagToPost);

// Relaciones: Comentarios incrustados en un Post
router.post('/:id/comments', createComment);
router.get('/:id/comments', getCommentsByPost);

// Relaciones: Imagenes por Incrustación
router.post('/:id/images', addImageToPost);       
router.delete('/:id/images', deleteImageFromPost);

export default router;