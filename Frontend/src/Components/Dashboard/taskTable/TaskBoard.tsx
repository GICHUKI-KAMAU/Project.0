import React, { useState, useEffect, FormEvent } from 'react';
import './TaskBoard.css';
import Modal from './Modal'; // Import the Modal component

interface Task {
  id: string;
  description: string;
  status: 'waiting' | 'in-progress' | 'completed';
  dueDate: string;
  projectId: string;
  assignedToId: string;
}

interface Comment {
  id: string;
  content: string;
  taskId: string | null;
  userId: string;
}

interface Project {
  id: string;
  name: string;
  teamId: string;
}

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('admin');
  const [comments, setComments] = useState<Comment[]>([]);
  const [userId, setUserId] = useState<string>('1');
  const [content, setContent] = useState<string>(''); // State for the comment input
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskStatuses, setTaskStatuses] = useState<{ [key: string]: Task['status'] }>({});
  const [projects, setProjects] = useState<Project[]>([]); // State for projects
  const [selectedProjectId, setSelectedProjectId] = useState<string>(''); // State for selected project
  const [assignedToId, setAssignedToId] = useState<string>(''); // State for selected team member

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3000/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data: Task[] = await response.json();
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          throw new Error('Tasks data is not an array');
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('http://localhost:3000/comments');
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data: Comment[] = await response.json();
        if (Array.isArray(data)) {
          setComments(data);
        } else {
          throw new Error('Comments data is not an array');
        }
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchComments();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:3000/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data: Project[] = await response.json();
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          throw new Error('Projects data is not an array');
        }
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchProjects();
  }, []);

  // Handle loading and error states
  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  // Group tasks by their status
  const waitingTasks = tasks.filter(task => task.status === 'waiting');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleUpdateTask = (task: Task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleAddComment = async (taskId: string, content: string) => {
    try {
      const response = await fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, taskId, userId }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments((prevComments) => [...prevComments, newComment]);
        setContent('');
      } else {
        alert('Failed to add comment. Please try again.');
      }
    } catch (error) {
      alert('An error occurred while adding the comment. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      } else {
        alert('Failed to delete task. Please try again.');
      }
    } catch (error) {
      alert('An error occurred while deleting the task. Please try again.');
    }
  };

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    setTaskStatuses((prevStatuses) => ({
      ...prevStatuses,
      [taskId]: status,
    }));
  };

  const handleStatusUpdate = async (task: Task) => {
    try {
      const updatedStatus = taskStatuses[task.id] || task.status;
      const response = await fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...task, status: updatedStatus }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        );
      } else {
        alert('Failed to update task status.');
      }
    } catch (error) {
      alert('An error occurred while updating task status.');
    }
  };

  const renderTask = (task: Task) => {
    const selectedStatus = taskStatuses[task.id] || task.status;

    return (
      <div
        key={task.id}
        className={`task-card ${task.status} ${selectedTaskId === task.id ? 'selected' : ''}`}
        onClick={() => handleTaskClick(task.id)}
      >
        <p>{task.description}</p>
        <span>Due: {task.dueDate}</span>

        {selectedTaskId === task.id && (
          <div className="comment-section">
            <input
              type="text"
              placeholder="Add a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              onClick={() => {
                if (content) {
                  handleAddComment(task.id, content);
                  setContent(''); // Clear the input field after posting
                }
              }}
            >
              Post
            </button>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
              className="status-dropdown"
            >
              {['waiting', 'in-progress', 'completed'].map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <button onClick={() => handleStatusUpdate(task)} className="update-status-button">
              Update Status
            </button>
          </div>
        )}

        <div className="comments">
          {comments
            .filter((comment) => comment.taskId === task.id)
            .map((comment) => (
              <div key={comment.id} className="comment">
                <p>{comment.content}</p>
              </div>
            ))}
        </div>

        {selectedTaskId === task.id && userRole === 'admin' && (
          <div className="task-actions">
            <button onClick={() => handleUpdateTask(task)}>Update</button>
            <button className="delete" onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </div>
        )}
      </div>
    );
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault(); // Prevent default form submission
    if (currentTask) {
      handleStatusUpdate(currentTask); // Update the task
      setIsModalOpen(false); // Close the modal after updating
    }
  };

  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProjectId(event.target.value);
  };

  const handleTeamMemberChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAssignedToId(event.target.value);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesProject = selectedProjectId ? task.projectId === selectedProjectId : true;
    const matchesTeamMember = assignedToId ? task.assignedToId === assignedToId : true;
    return matchesProject && matchesTeamMember;
  });

  return (
    <div className="task-board">
      <h1>Task Board</h1>

      {/* Container for Dropdowns */}
      <div className="dropdown-container">
        {/* Dropdown for Projects */}
        <select onChange={handleProjectChange} value={selectedProjectId}>
          <option value="">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        {/* Dropdown for Team Members */}
        <select onChange={handleTeamMemberChange} value={assignedToId}>
          <option value="">All Team Members</option>
          {/* Add your team members here */}
          <option value="1">Team Member 1</option>
          <option value="2">Team Member 2</option>
          <option value="3">Team Member 3</option>
        </select>
      </div>

      <div className="kanban">
        <div className="column waiting">
          <h2>Waiting</h2>
          {filteredTasks.filter(task => task.status === 'waiting').map(renderTask)}
        </div>
        <div className="column in-progress">
          <h2>In Progress</h2>
          {filteredTasks.filter(task => task.status === 'in-progress').map(renderTask)}
        </div>
        <div className="column completed">
          <h2>Completed</h2>
          {filteredTasks.filter(task => task.status === 'completed').map(renderTask)}
        </div>
      </div>

      {/* Modal for updating tasks */}
      {isModalOpen && currentTask && (
        <Modal onClose={() => setIsModalOpen(false)} isOpen={false}>
          <h2>Update Task</h2>
          <form onSubmit={handleFormSubmit}>
            <label>
              Description:
              <input
                type="text"
                value={currentTask.description}
                onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
              />
            </label>
            <button type="submit">Update</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TaskBoard;
