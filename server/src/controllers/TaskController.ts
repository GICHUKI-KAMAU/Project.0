import { Request, Response } from 'express';
import { getXataClient } from '../xata';

const xata = getXataClient();

export const createTask = async (req: Request, res: Response): Promise<void> => {
  const { description, due_date, AssignedToName, project_name, status } = req.body;

  try {

    const user = await xata.db.Users.filter({ username: AssignedToName }).getFirst();
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const project = await xata.db.project.filter({ name: project_name }).getFirst();
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const formattedDueDate = new Date(due_date).toISOString();
    
    const booleanStatus = status === 'true' || status === true;

    const task = await xata.db.task.create({
      description,
      due_date: formattedDueDate,
      AssignedToId: user.xata_id,
      project_id: project.xata_id,
      status: booleanStatus
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
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
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching task' });
  }
};


export const updateTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { description, due_date, AssignedToName, project_name, status } = req.body;

  try {

    const user = await xata.db.Users.filter({ username: AssignedToName }).getFirst();
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const project = await xata.db.project.filter({ name: project_name }).getFirst();
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const formattedDueDate = new Date(due_date).toISOString();
    
    const booleanStatus = status !== undefined ? (status === 'true' || status === true) : undefined;

    const updateData: any = {
      description,
      due_date: formattedDueDate,
      AssignedToId: user.xata_id,
      project_id: project.xata_id,
      status: booleanStatus,
    };

    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const task = await xata.db.task.update(id, updateData);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
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
