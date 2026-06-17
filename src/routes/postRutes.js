import { Router } from 'express';

import {
    createPost,
    getAllPosts,
    deletePost
} from '../controllers/postController.js';

import { validateSchema } from '../schemas/userSchema.js';
import { createPostSchema} from '../schemas/postSchema.js';

const router = Router();

router.post('/', validateSchema(createPostSchema), createPost);
router.get('/', getAllPosts);
router.get('/', getAllPosts);
router.delete('/:id', deletePost);


export default router;