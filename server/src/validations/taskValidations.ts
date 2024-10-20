import { body, param } from 'express-validator';

export const createTaskValidation = [
  body('description').notEmpty().withMessage('Description is required'),
  body('AssignedToId').notEmpty().isString().withMessage('Assigned User is required'),
  body('due_date').isISO8601().toDate().withMessage('Due date is required'),
  body('project_id').isString().withMessage('Project ID is required'),
  body('status').optional().isBoolean().withMessage('Status must be boolean'),
];

export const updateTaskValidation = [
  param('id').isString().withMessage('Task ID must be a string'),
  body('description').optional().isString(),
  body('AssignedToId').optional().isString(),
  body('due_date').optional().isISO8601().toDate(),
  body('status').optional().isBoolean(),
];

export const getTaskValidation = [
  param('id').isString().withMessage('Task ID must be a string'),
];

export const deleteTaskValidation = [
  param('id').isString().withMessage('Task ID must be a string'),
];
