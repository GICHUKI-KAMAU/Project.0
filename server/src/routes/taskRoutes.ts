import { Router } from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/TaskController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// router.post('/', authMiddleware, createTask);
router.post('/', createTask);
// router.get('/', authMiddleware, getTasks);
router.get('/', getTasks);
// router.get('/:id', authMiddleware, getTaskById);
// router.put('/:id', authMiddleware, updateTask);
// router.delete('/:id', authMiddleware, deleteTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
