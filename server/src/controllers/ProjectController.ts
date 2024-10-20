import { Request, Response } from 'express';
import { getXataClient } from '../xata';

const xata = getXataClient();

export const createProject = async (req: Request, res: Response): Promise<void> => {
  const { name, team_ID } = req.body;

  try {
    const project = await xata.db.project.create({
      name,
      team_ID,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error creating project' });
  }
};

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await xata.db.project.getAll();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects' });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const project = await xata.db.project.read(id);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching project' });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, team_ID } = req.body;

  try {
    const project = await xata.db.project.update(id, {
      name,
      team_ID,
    });

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error updating project' });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await xata.db.project.delete(id);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Error deleting project' });
  }
};

// Export all functions as ProjectController
export const ProjectController = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
