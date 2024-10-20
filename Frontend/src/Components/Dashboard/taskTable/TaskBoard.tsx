import React from 'react';
import './TaskBoard.css';
import tasksData from '../../MockData/mock.json';

interface Task {
  id: string;
  description: string;
  status: 'waiting' | 'in-progress' | 'completed';
  dueDate: string;
  projectId: string;
  assignedToId: string;
}

const TaskBoard: React.FC = () => {
  // Use tasksData imported from the mock.json file
  const tasks: Task[] = tasksData.tasks.map(task => ({
    ...task,
    status: task.status as 'waiting' | 'in-progress' | 'completed'
  }));

  // Group tasks by their status
  const waitingTasks = tasks.filter(task => task.status === 'waiting');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="task-board">
      <div className="kanban-column">
        <h2>Waiting</h2>
        {waitingTasks.map(task => (
          <div key={task.id} className="task-card waiting">
            <p>{task.description}</p>
            <span>Due: {task.dueDate}</span>
          </div>
        ))}
      </div>

      <div className="kanban-column">
        <h2>In Progress</h2>
        {inProgressTasks.map(task => (
          <div key={task.id} className="task-card in-progress">
            <p>{task.description}</p>
            <span>Due: {task.dueDate}</span>
          </div>
        ))}
      </div>

      <div className="kanban-column">
        <h2>Completed</h2>
        {completedTasks.map(task => (
          <div key={task.id} className="task-card completed">
            <p>{task.description}</p>
            <span>Due: {task.dueDate}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
