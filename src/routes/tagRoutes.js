import { Router } from 'express';

import {
  createTag,
  getAllTags,
  updateTag,
  deleteTag
} from '../controllers/tagController.js';

const router = Router();

// CRUD de Tags
router.post('/', createTag);
router.get('/', getAllTags);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router;