// controllers/TeamController.ts
import { Request, Response } from 'express';
import { getXataClient } from '../xata';

const xata = getXataClient();

const createTeam = async (req: Request, res: Response): Promise<void> => {
  const { name, description, team_lead } = req.body;

  try {
    const user = await xata.db.Users.filter({ username: team_lead }).getFirst();
    
    if (!user) {
      res.status(404).json({ message: 'Team lead not found' });
      return
    }

    const team = await xata.db.team.create({
      name,
      description,
      team_lead: user.xata_id,
    });

    res.status(201).json(team);
  } catch (error) {
    console.error("Error during team creation:", error);
    res.status(500).json({ error: 'Error creating team' });
  }
};

const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await xata.db.team.getAll();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching teams' });
  }
};

const getTeamById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  try {
    const team = await xata.db.team.read(id);

    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching team' });
  }
};

const updateTeam = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, description, team_lead } = req.body;

  const user = await xata.db.Users.filter({ username: team_lead }).getFirst();
    
    if (!user) {
      res.status(404).json({ message: 'Team lead not found' });
      return
    }

  try {
    const team = await xata.db.team.update(id, {
      name,
      description,
      team_lead: user.xata_id,
    });

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ error: 'Error updating team' });
  }
};

const deleteTeam = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await xata.db.team.delete(id); // Adjust this according to your Xata schema
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Error deleting team' });
  }
};

// Exporting the functions as part of an object
export const TeamController = {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
};