import { Router } from 'express';

import {
    createPost,
    getAllPosts,
    deletePost
} from '../controllers/postController.js';

import { validateSchema } from '../schemas/userSchema.js';
import { createPostSchema} from '../schemas/postSchema.js';
import { addTagToPost } from '../controllers/tagController.js';
const router = Router();

router.post('/', validateSchema(createPostSchema), createPost);
router.get('/', getAllPosts);

router.post('/:id/tags', addTagToPost);

router.delete('/:id', deletePost);


export default router;