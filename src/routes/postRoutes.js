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
import { createComment, getCommentsByPost, deleteComment } from '../controllers/commentController.js'

const router = Router();

// CRUD de Post
router.post('/', validateSchema(createPostSchema), createPost);
router.get('/', getAllPosts);
router.put('/:id', updatePost)
router.delete('/:id', deletePost);

// Relaciones: Tags y Comentarios
router.post('/:id/tags', addTagToPost);
router.post('/:id/comments', createComment);
router.get('/:id/comments', getCommentsByPost);
router.delete('/comments/:id', deleteComment);

// Realaciones: Imagenes por Inscrustación
router.post('/:id/images', addImageToPost);       
router.delete('/:id/images', deleteImageFromPost);

export default router;