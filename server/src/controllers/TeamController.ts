import { Request, Response } from 'express';
import { getXataClient } from '../xata';

const xata = getXataClient();

const createTeam = async (req: Request, res: Response): Promise<void> => {
  const { name, description, team_lead } = req.body;

  try {
    const existingTeam = await xata.db.team.filter({ name }).getFirst();

    if (existingTeam) {
      res.status(400).json({ message: 'A team with this name already exists.' });
      return;
    }

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
  const { name } = req.params;

  try {
    const teams = await xata.db.team.filter({ name }).getAll();
    
    if (teams.length === 0) {
      res.status(404).json({ message: 'Team not found' });
      return; // Exit if no team matches the name
    }

    const teamToDelete = teams[0];
    
    const associatedProjects = await xata.db.project.filter({ team_ID: teamToDelete.xata_id }).getAll();
    if (associatedProjects.length > 0) {
      res.status(400).json({ message: 'Cannot delete team with associated projects' });
      return;
    }

    // If no associated projects, delete the team
    await xata.db.team.delete(teamToDelete.xata_id);
    res.status(204).send(); // No content
    
  } catch (error) {
    console.error("Error during deleting a team:", error);
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