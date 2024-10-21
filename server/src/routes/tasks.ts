import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/TaskController'; 
import {
  createTaskValidation,
  updateTaskValidation,
  getTaskValidation,
  deleteTaskValidation,
} from '../validations/taskValidations'; // Change these validation names for tasks

const router = Router();

router.get('/', getTasks);

router.get('/:id', getTaskValidation, getTaskById);

router.post('/', createTaskValidation, createTask);

router.put('/:id', updateTaskValidation, updateTask);

router.delete('/:id', deleteTaskValidation, deleteTask);


export default router;
