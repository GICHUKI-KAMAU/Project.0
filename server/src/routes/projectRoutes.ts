import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, ProjectController.createProject);
router.get('/', authMiddleware, ProjectController.getProjects);
router.get('/:id', authMiddleware, ProjectController.getProjectById);
router.put('/:id', authMiddleware, ProjectController.updateProject);
router.delete('/:id', authMiddleware, ProjectController.deleteProject);

export default router;
