import { Request, Response } from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/TaskController';
import { getXataClient } from '../xata';

// Mocking Xata client
jest.mock('../xata');
const xata = getXataClient();

// Helper to mock Request and Response
const mockRequest = (body = {}, params = {}) => ({
  body,
  params,
}) as Request;

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  res.clearCookie = jest.fn().mockReturnThis();
  return res;
};

describe('TaskController', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const req = mockRequest({
        description: 'New Task',
        due_date: '2024-12-31',
        AssignedToName: 'JohnDoe',
        project_name: 'ProjectA',
        status: 'true',
      });
      const res = mockResponse();

      xata.db.Users.filter.mockReturnValueOnce({
        getFirst: jest.fn().mockResolvedValueOnce({ xata_id: 'user1' })
      });

      xata.db.project.filter.mockReturnValueOnce({
        getFirst: jest.fn().mockResolvedValueOnce({ xata_id: 'project1' })
      });

      xata.db.task.create.mockResolvedValueOnce({
        description: 'New Task',
        due_date: '2024-12-31T00:00:00.000Z',
        AssignedToId: 'user1',
        project_id: 'project1',
        status: true
      });

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        description: 'New Task',
        status: true
      }));
    });

    it('should return 404 if user is not found', async () => {
      const req = mockRequest({
        description: 'New Task',
        due_date: '2024-12-31',
        AssignedToName: 'UnknownUser',
        project_name: 'ProjectA',
        status: 'true',
      });
      const res = mockResponse();

      xata.db.Users.filter.mockReturnValueOnce({
        getFirst: jest.fn().mockResolvedValueOnce(null)
      });

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 404 if project is not found', async () => {
      const req = mockRequest({
        description: 'New Task',
        due_date: '2024-12-31',
        AssignedToName: 'JohnDoe',
        project_name: 'UnknownProject',
        status: 'true',
      });
      const res = mockResponse();

      xata.db.Users.filter.mockReturnValueOnce({
        getFirst: jest.fn().mockResolvedValueOnce({ xata_id: 'user1' })
      });

      xata.db.project.filter.mockReturnValueOnce({
        getFirst: jest.fn().mockResolvedValueOnce(null)
      });

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Project not found' });
    });
  });

  describe('getTasks', () => {
    it('should return all tasks', async () => {
      const req = mockRequest();
      const res = mockResponse();

      xata.db.task.getAll.mockResolvedValueOnce([
        { description: 'Task 1' },
        { description: 'Task 2' }
      ]);

      await getTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { description: 'Task 1' },
        { description: 'Task 2' }
      ]);
    });

    it('should return 500 if there is an error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      xata.db.task.getAll.mockRejectedValueOnce(new Error('Database error'));

      await getTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching tasks' });
    });
  });

  describe('getTaskById', () => {
    it('should return the task by ID', async () => {
      const req = mockRequest({}, { id: 'task1' });
      const res = mockResponse();

      xata.db.task.read.mockResolvedValueOnce({ description: 'Task 1', xata_id: 'task1' });

      await getTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ description: 'Task 1', xata_id: 'task1' });
    });

    it('should return 404 if the task is not found', async () => {
      const req = mockRequest({}, { id: 'unknown' });
      const res = mockResponse();

      xata.db.task.read.mockResolvedValueOnce(null);

      await getTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const req = mockRequest(
        { description: 'Updated Task', due_date: '2024-12-31', AssignedToName: 'JohnDoe', project_name: 'ProjectA', status: 'true' },
        { id: 'task1' }
      );
      const res = mockResponse();

      xata.db.Users.filter.mockReturnValueOnce({
        getFirst: jest.fn().mockResolvedValueOnce({ xata_id: 'user1' })
      });

      xata.db.project.filter.mockReturnValueOnce({
        getFirst: jest.fn().mockResolvedValueOnce({ xata_id: 'project1' })
      });

      xata.db.task.update.mockResolvedValueOnce({
        description: 'Updated Task',
        status: true
      });

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ description: 'Updated Task' }));
    });

    it('should return 404 if task is not found', async () => {
      const req = mockRequest({}, { id: 'unknown' });
      const res = mockResponse();

      xata.db.task.update.mockResolvedValueOnce(null);

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const req = mockRequest({}, { id: 'task1' });
      const res = mockResponse();

      xata.db.task.delete.mockResolvedValueOnce(true);

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 500 if there is an error', async () => {
      const req = mockRequest({}, { id: 'task1' });
      const res = mockResponse();

      xata.db.task.delete.mockRejectedValueOnce(new Error('Error deleting task'));

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error deleting task' });
    });
  });
});
