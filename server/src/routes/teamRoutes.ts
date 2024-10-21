import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, TeamController.createTeam);
router.get('/', authMiddleware, TeamController.getTeams);
router.get('/:id', authMiddleware, TeamController.getTeamById);
router.put('/:id', authMiddleware, TeamController.updateTeam);
router.delete('/:id', authMiddleware, TeamController.deleteTeam);

export default router;
