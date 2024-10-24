import { Request, Response } from 'express';
import { getXataClient } from '../xata';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwtUtils'; // Ensure this function exists and properly verifies the JWT token

const xata = getXataClient();

export const createTask = async (req: Request, res: Response): Promise<void> => {
  const { description, due_date, AssignedToName, project_name, status = 'waiting' } = req.body;

  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: 'Authentication token is missing' });
      return;
    }

    // Verify the token and extract user info
    const payload = verifyToken(token) as JwtPayload;
    const requestingUser = await xata.db.Users.read(payload.id); // Get the user from the token payload

    if (!requestingUser) { // Check if requestingUser is null
      res.status(404).json({ error: 'User not found' });
      return;
    }

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

    const team = await xata.db.team.read(project.team_ID);
    if (!team || team.team_lead.xata_id !== requestingUser.xata_id) { // Access xata_id correctly
      res.status(403).json({ error: 'Forbidden: Only the team lead can create tasks' });
      return;
    }

    const formattedDueDate = new Date(due_date).toISOString();
    
    const validStatuses = ['waiting', 'in progress', 'completed']; // status
    const taskStatus = validStatuses.includes(status) ? status : 'waiting';

    const task = await xata.db.task.create({
      description, 
      // desc
      due_date: formattedDueDate,
      AssignedToId: user.xata_id,
      project_id: project.xata_id,
      status: [taskStatus]
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

export const getTaskById = async (req: Request, res: Response) => {
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
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: 'Authentication token is missing' });
      return;
    }

    // Verify the token and extract user info
    const payload = verifyToken(token) as JwtPayload;
    const requestingUser = await xata.db.Users.read(payload.id); // Get the user from the token payload

    if (!requestingUser) { // Check if requestingUser is null
      res.status(404).json({ error: 'User not found' });
      return;
    }

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

    const team = await xata.db.team.read(project.team_ID);
    if (!team || team.team_lead.xata_id !== requestingUser.xata_id) {
      res.status(403).json({ error: 'Forbidden: Only the team lead can update tasks' });
      return;
    }

    const formattedDueDate = new Date(due_date).toISOString();

    const validStatuses = ['waiting', 'in-progress', 'completed'];
    const taskStatus = status && validStatuses.includes(status) ? status : 'waiting';

    const updateData: any = {
      description,
      due_date: formattedDueDate,
      AssignedToId: user.xata_id,
      project_id: project.xata_id,
      status: [taskStatus],
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
