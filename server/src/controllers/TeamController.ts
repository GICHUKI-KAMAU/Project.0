import { Request, Response } from 'express';
import { getXataClient } from '../xata';

const xata = getXataClient();

const createTeam = async (req: Request, res: Response): Promise<void> => {
  const { name, description, team_lead, members } = req.body;

  try {
    const existingTeam = await xata.db.team.filter({ name }).getFirst();

    if (existingTeam) {
      res.status(400).json({ message: 'A team with this name already exists.' });
      return;
    }

    // Fetch the team lead user
    const teamLeadUser = await xata.db.Users.filter({ username: team_lead }).getFirst();
    
    if (!teamLeadUser) {
      res.status(404).json({ message: 'Team lead not found' });
      return
    }

    // Fetch the members
    const memberRecords = [];

    for (const member of members) {

      const memberRecord = await xata.db.Users.filter({ username: member }).getFirst();
      
      if (!memberRecord) {
        res.status(404).json({ message: `User ${member} not found` });
        return;
      }

      memberRecords.push(memberRecord.xata_id);  // Add member IDs
    }

    const team = await xata.db.team.create({
      name,
      description,
      team_lead: teamLeadUser.xata_id,
      members: memberRecords
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

    const formattedTeams = await Promise.all(
      teams.map(async (team) => {
        const teamLead = await xata.db.Users.read(team.team_lead);
        return {
          ...team,
          team_lead_name: teamLead?.username, // Add team lead username
          members: await Promise.all((team.members ?? []).map(async (memberId) => { // Use nullish coalescing
            const member = await xata.db.Users.read(memberId);
            return member?.username; // Add member usernames
          })),
        };
      })
    );

    res.status(200).json(formattedTeams);
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

    // Fetch team lead and members
    const teamLead = await xata.db.Users.read(team.team_lead);
    const members = await Promise.all((team.members ?? []).map(async (memberId) => { // Use nullish coalescing
      const member = await xata.db.Users.read(memberId);
      return member?.username; // Add member usernames
    }));

    res.status(200).json({
      ...team,
      team_lead_name: teamLead?.username, // Add team lead username
      members, // Add members
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching team' });
  }
};

const updateTeam = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, description, team_lead, members } = req.body;

  try {
    const teamLeadUser = await xata.db.Users.filter({ username: team_lead }).getFirst();
    if (!teamLeadUser) {
      res.status(404).json({ message: 'Team lead not found' });
      return;
    }

    // Fetch and validate members
    const memberRecords = [];
    for (const member of members) {
      const memberRecord = await xata.db.Users.filter({ username: member }).getFirst();
      if (!memberRecord) {
        res.status(404).json({ message: `User ${member} not found` });
        return;
      }
      memberRecords.push(memberRecord.xata_id); // Add member IDs
    }

    const team = await xata.db.team.update(id, {
      name,
      description,
      team_lead: teamLeadUser.xata_id,
      members: memberRecords, // Update members
    });

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ error: 'Error updating team' });
  }
};

const deleteTeam = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Changed to use ID instead of name

  try {
    const teamToDelete = await xata.db.team.read(id);
    
    if (!teamToDelete) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

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