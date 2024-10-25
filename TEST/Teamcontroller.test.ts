import { Request, Response } from 'express';
import { getXataClient } from '../server/src/xata';
import { TeamController } from '../server/src/controllers/TeamController';

jest.mock('../xata'); // Mock the Xata client

const mockXataClient = getXataClient as jest.MockedFunction<typeof getXataClient>;
const xataMock = {
  db: {
    team: {
      filter: jest.fn(),
      getAll: jest.fn(),
      create: jest.fn(),
      read: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    Users: {
      filter: jest.fn(),
    },
  },
};

mockXataClient.mockReturnValue(xataMock); // Return the mocked database

describe('TeamController'), () => {

  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    req = {
      body: {},
      params: {},
    };
    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTeam', () => {
    it('should create a new team if valid data is provided', async () => {
      req.body = { name: 'Team A', description: 'Description A', team_lead: 'leaderA' };

      xataMock.db.team.filter.mockReturnValue({
        getFirst: jest.fn().mockResolvedValue(null),
      });
      xataMock.db.Users.filter.mockReturnValue({
        getFirst: jest.fn().mockResolvedValue({ xata_id: 'user123' }),
      });
      xataMock.db.team.create.mockResolvedValue({ name: 'Team A' });

      await TeamController.createTeam(req as Request, res as Response);

      expect(xataMock.db.team.filter).toHaveBeenCalledWith({ name: 'Team A' });
      expect(xataMock.db.Users.filter).toHaveBeenCalledWith({ username: 'leaderA' });
      expect(xataMock.db.team.create).toHaveBeenCalledWith({
        name: 'Team A',
        description: 'Description A',
        team_lead: 'user123',
      });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({ name: 'Team A' });
    });

    it('should return 400 if team with the same name already exists', async () => {
      req.body = { name: 'Team A', description: 'Description A', team_lead: 'leaderA' };

      xataMock.db.team.filter.mockReturnValue({
        getFirst: jest.fn().mockResolvedValue({ name: 'Team A' }),
      });

      await TeamController.createTeam(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'A team with this name already exists.' });
    });

    it('should return 404 if the team lead is not found', async () => {
      req.body = { name: 'Team A', description: 'Description A', team_lead: 'leaderA' };

      xataMock.db.team.filter.mockReturnValue({
        getFirst: jest.fn().mockResolvedValue(null),
      });
      xataMock.db.Users.filter.mockReturnValue({
        getFirst: jest.fn().mockResolvedValue(null),
      });

      await TeamController.createTeam(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Team lead not found' });
    });

    it('should return 500 on server error', async () => {
      req.body = { name: 'Team A', description: 'Description A', team_lead: 'leaderA' };

      xataMock.db.team.filter.mockReturnValue({
        getFirst: jest.fn().mockRejectedValue(new Error('Server error')),
      });

      await TeamController.createTeam(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Error creating team' });
    });
  });

  describe('getTeams', () => {
    it('should return all teams', async () => {
      xataMock.db.team.getAll.mockResolvedValue([{ name: 'Team A' }, { name: 'Team B' }]);

      await TeamController.getTeams(req as Request, res as Response);

      expect(xataMock.db.team.getAll).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith([{ name: 'Team A' }, { name: 'Team B' }]);
    });

    it('should return 500 on server error', async () => {
      xataMock.db.team.getAll.mockRejectedValue(new Error('Server error'));

      await TeamController.getTeams(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Error fetching teams' });
    });
  });

  describe('getTeamById', () => {
    it('should return the team by ID', async () => {
      req.params = { id: 'team123' };
      xataMock.db.team.read.mockResolvedValue({ name: 'Team A' });

      await TeamController.getTeamById(req as Request, res as Response);

      expect(xataMock.db.team.read).toHaveBeenCalledWith('team123');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ name: 'Team A' });
    });

    it('should return 404 if team not found', async () => {
      req.params = { id: 'team123' };
      xataMock.db.team.read.mockResolvedValue(null);

      await TeamController.getTeamById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Team not found' });
    });

    it('should return 500 on server error', async () => {
      req.params = { id: 'team123' };
      xataMock.db.team.read.mockRejectedValue(new Error('Server error'));

      await TeamController.getTeamById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Error fetching team' });
    });
  });

  describe('updateTeam', () => {
    it('should update the team if valid data is provided', async () => {
      req.params = { id: 'team123' };
      req.body = { name: 'Team A', description: 'New Description', team_lead: 'leaderB' };

      xataMock.db.Users.filter.mockReturnValue({
        getFirst: jest.fn().mockResolvedValue({ xata_id: 'user456' }),
      });
      xataMock.db.team.update.mockResolvedValue({ name: 'Team A', description: 'New Description' });

      await TeamController.updateTeam(req as Request, res as Response);

      expect(xataMock.db.Users.filter).toHaveBeenCalledWith({ username: 'leaderB' });
      expect(xataMock.db.team.update).toHaveBeenCalledWith('team123', {
        name: 'Team A',
        description: 'New Description',
        team_lead: 'user456',
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ name: 'Team A', description: 'New Description' });
    });
  });

  describe('deleteTeam', () => {
    it('should delete the team if no associated projects exist', async () => {
      req.params = { name: 'Team A' };

      xataMock.db.team.filter.mockReturnValue({
        getAll: jest.fn().mockResolvedValue([{ xata_id: 'team123' }]),
      });
      xataMock.db.project.filter.mockReturnValue({
        getAll: jest.fn().mockResolvedValue([]), // No associated projects
      });

      await TeamController.deleteTeam(req as Request, res as Response);

      expect(xataMock.db.team.filter).toHaveBeenCalledWith({ name: 'Team A' });
      expect(xataMock.db.team.delete).toHaveBeenCalledWith('team123');
      expect(statusMock).toHaveBeenCalledWith(204);
    });

    it('should return 400 if the team has associated projects', async () => {
      req.params = { name: 'Team A' };

      xataMock.db.team.filter.mockReturnValue({
        getAll: jest.fn().mockResolvedValue([{ xata_id: 'team123' }]),
      });
      xataMock.db.project.filter.mockReturnValue({
        getAll: jest.fn().mockResolvedValue([{ name: 'Project A' }]), // Has associated projects
      });

      await TeamController.deleteTeam(req as Request, res as Response);

      expect(xataMock.db.team.filter).toHaveBeenCalledWith({ name: 'Team A' });
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock)
