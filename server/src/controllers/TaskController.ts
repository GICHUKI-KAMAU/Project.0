import { Request, Response } from 'express';
import { getXataClient } from '../xata';

const xata = getXataClient();

export const createTask = async (req: Request, res: Response) => {
  const { description, due_date, AssignedToId, project_id, status } = req.body;

  try {
    const task = await xata.db.task.create({
      description,
      due_date,
      AssignedToId,
      project_id,
      status,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await xata.db.task.getAll();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const task = await xata.db.task.read(id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return; // Exit the function to prevent further execution
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching task' });
  }
};


export const updateTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { description, due_date, AssignedToId, project_id, status } = req.body;

  try {
    const task = await xata.db.task.update(id, {
      description,
      due_date,
      AssignedToId,
      project_id,
      status,
    });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
};


export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await xata.db.task.delete(id);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
};
