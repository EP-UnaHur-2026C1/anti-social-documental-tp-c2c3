import { Router } from 'express';

import {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag
} from '../controllers/tagController.js';

const router = Router();

// CRUD de Tags
router.post('/', createTag);
router.get('/', getAllTags);
router.get('/:id', getTagById);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router;