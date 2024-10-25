import { Router } from 'express';
import { CommentController } from '../controllers/CommentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// router.post('/', authMiddleware, CommentController.createComment);
// router.get('/:taskId', authMiddleware, CommentController.getCommentsByTask);
router.post('/', CommentController.createComment);
router.get('/:taskId', CommentController.getCommentsByTask);

export default router;
