import { Router } from 'express';

import {
    createPost,
    getAllPosts,
    deletePost
} from '../controllers/postController.js';

import { validateSchema } from '../schemas/userSchema.js';
import { createPostSchema} from '../schemas/postSchema.js';
import { addTagToPost } from '../controllers/tagController.js';
import { createComment, getCommentsByPost, deleteComment } from '../controllers/commentController.js'

const router = Router();

router.post('/', validateSchema(createPostSchema), createPost);
router.get('/', getAllPosts);

router.post('/:id/tags', addTagToPost);

router.delete('/:id', deletePost);

router.post('/:id/comments', createComment);
router.get('/:id/comments', getCommentsByPost);
router.delete('/comments/:id', deleteComment);


export default router;