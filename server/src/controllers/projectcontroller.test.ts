import { Request, Response } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { getXataClient } from '../xata';

jest.mock('../xata', () => ({
  getXataClient: jest.fn(),
}));

const mockXataClient = {
  db: {
    team: {
      filter: jest.fn().mockReturnThis(),
      getFirst: jest.fn(),
    },
    project: {
      create: jest.fn(),
      getAll: jest.fn(),
      filter: jest.fn().mockReturnThis(),
      getAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
};

(getXataClient as jest.Mock).mockReturnValue(mockXataClient);

describe('ProjectController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnValue(res);
    jsonMock = jest.fn().mockReturnValue(res);
    sendMock = jest.fn().mockReturnValue(res);

    res = {
      status: statusMock,
      json: jsonMock,
      send: sendMock,
    };

    req = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('should return 404 if team is not found', async () => {
      req.body = { name: 'New Project', team_name: 'Non-existing Team' };
      mockXataClient.db.team.getFirst.mockResolvedValue(null);

      await ProjectController.createProject(req as Request, res as Response);

      expect(mockXataClient.db.team.filter).toHaveBeenCalledWith({ name: 'Non-existing Team' });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Team not found' });
    });

    it('should create a new project and return 201', async () => {
      req.body = { name: 'New Project', team_name: 'Team A' };
      const mockTeam = { xata_id: 'team123' };
      const mockProject = { name: 'New Project', team_ID: 'team123' };

      mockXataClient.db.team.getFirst.mockResolvedValue(mockTeam);
      mockXataClient.db.project.create.mockResolvedValue(mockProject);

      await ProjectController.createProject(req as Request, res as Response);

      expect(mockXataClient.db.team.filter).toHaveBeenCalledWith({ name: 'Team A' });
      expect(mockXataClient.db.project.create).toHaveBeenCalledWith({
        name: 'New Project',
        team_ID: 'team123',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockProject);
    });
  });

  describe('getProjects', () => {
    it('should return all projects', async () => {
      const mockProjects = [{ name: 'Project 1' }, { name: 'Project 2' }];
      mockXataClient.db.project.getAll.mockResolvedValue(mockProjects);

      await ProjectController.getProjects(req as Request, res as Response);

      expect(mockXataClient.db.project.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProjects);
    });

    it('should return 500 on error', async () => {
      mockXataClient.db.project.getAll.mockRejectedValue(new Error('DB Error'));

      await ProjectController.getProjects(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching projects' });
    });
  });

  describe('getProjectById', () => {
    it('should return 404 if project is not found', async () => {
      req.params = { name: 'Non-existing Project' };
      mockXataClient.db.project.filter.mockReturnThis();
      mockXataClient.db.project.getAll.mockResolvedValue([]);

      await ProjectController.getProjectById(req as Request, res as Response);

      expect(mockXataClient.db.project.filter).toHaveBeenCalledWith({ name: 'Non-existing Project' });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Project not found' });
    });

    it('should return the project if found', async () => {
      req.params = { name: 'Project A' };
      const mockProject = { name: 'Project A' };
      mockXataClient.db.project.filter.mockReturnThis();
      mockXataClient.db.project.getAll.mockResolvedValue([mockProject]);

      await ProjectController.getProjectById(req as Request, res as Response);

      expect(mockXataClient.db.project.filter).toHaveBeenCalledWith({ name: 'Project A' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProject);
    });
  });

  describe('updateProject', () => {
    it('should return 404 if team is not found', async () => {
      req.params = { id: 'project123' };
      req.body = { name: 'Updated Project', team_name: 'Non-existing Team' };
      mockXataClient.db.team.getFirst.mockResolvedValue(null);

      await ProjectController.updateProject(req as Request, res as Response);

      expect(mockXataClient.db.team.filter).toHaveBeenCalledWith({ name: 'Non-existing Team' });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Team not found' });
    });

    it('should update the project and return 200', async () => {
      req.params = { id: 'project123' };
      req.body = { name: 'Updated Project', team_name: 'Team A' };
      const mockTeam = { xata_id: 'team123' };
      const mockProject = { name: 'Updated Project', team_ID: 'team123' };

      mockXataClient.db.team.getFirst.mockResolvedValue(mockTeam);
      mockXataClient.db.project.update.mockResolvedValue(mockProject);

      await ProjectController.updateProject(req as Request, res as Response);

      expect(mockXataClient.db.project.update).toHaveBeenCalledWith('project123', {
        name: 'Updated Project',
        team_ID: 'team123',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProject);
    });
  });

  describe('deleteProject', () => {
    it('should delete the project and return 204', async () => {
      req.params = { id: 'project123' };

      await ProjectController.deleteProject(req as Request, res as Response);

      expect(mockXataClient.db.project.delete).toHaveBeenCalledWith('project123');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      req.params = { id: 'project123' };
      mockXataClient.db.project.delete.mockRejectedValue(new Error('DB Error'));

      await ProjectController.deleteProject(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error deleting project' });
    });
  });
});
