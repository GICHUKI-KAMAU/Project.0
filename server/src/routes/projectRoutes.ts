import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/adminMiddleware';

const router = Router();

// router.post('/', isAdmin, authMiddleware, ProjectController.createProject);
// router.get('/', authMiddleware, ProjectController.getProjects);
// router.get('/:id', authMiddleware, ProjectController.getProjectById);
// router.put('/:id', isAdmin, authMiddleware, ProjectController.updateProject);
// router.delete('/:id', isAdmin, authMiddleware, ProjectController.deleteProject);
router.post('/', ProjectController.createProject);
router.get('/', ProjectController.getProjects);
router.get('/:id', ProjectController.getProjectById);
router.put('/:id', ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);


export default router;
