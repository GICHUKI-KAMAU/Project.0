import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/adminMiddleware';

const router = Router();

// router.post('/', isAdmin, authMiddleware, TeamController.createTeam);
// router.get('/', authMiddleware, TeamController.getTeams);
// router.get('/:id', authMiddleware, TeamController.getTeamById);
// router.put('/:id', isAdmin, authMiddleware, TeamController.updateTeam);
// router.delete('/:id', isAdmin, authMiddleware, TeamController.deleteTeam);

router.post('/', TeamController.createTeam);
router.get('/', TeamController.getTeams);
router.get('/:id', TeamController.getTeamById);
router.put('/:id', TeamController.updateTeam);
router.delete('/:id', TeamController.deleteTeam);

export default router;
