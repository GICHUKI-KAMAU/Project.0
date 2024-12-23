import { Request, Response } from 'express';
import { getXataClient } from '../xata';

const xata = getXataClient();

export const createProject = async (req: Request, res: Response): Promise<void> => {
  const { name, team_name } = req.body;

  try {

    const team = await xata.db.team.filter({ name: team_name }).getFirst();

    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    const project = await xata.db.project.create({
      name,
      team_ID: team.xata_id,
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
  const { name } = req.params;

  try {
    const projects = await xata.db.project.filter({ name }).getAll(); // Query by name

    if (projects.length === 0) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.status(200).json(projects[0]); // Return the first matching project
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: 'Error fetching project' });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, team_name } = req.body;

  try {

    const team = await xata.db.team.filter({ name: team_name }).getFirst();

    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    const project = await xata.db.project.update(id, {
      name,
      team_ID: team.xata_id,
    });

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Error updating project:', error);
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
