import { Request, Response } from 'express';
import { getXataClient } from '../xata';

const xata = getXataClient();

interface CustomRequest extends Request {
  user?: { id: string; role: string };
}

export const createComment = async (req: CustomRequest, res: Response): Promise<void> => {
  const { comment, taskId } = req.body;

  try {
    const newComment = await xata.db.comment.create({
      comment,
      taskId,
      userId: req.user?.id,
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Error creating comment' });
  }
};

export const getCommentsByTask = async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;

  try {
    const comments = await xata.db.comment.filter({ taskId }).getAll();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
};

export const CommentController = {
  createComment,
  getCommentsByTask,
};
