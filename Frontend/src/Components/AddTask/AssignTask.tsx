import React, { useState, useEffect } from "react";
import axios from "axios";
import './AssignTask.css';

interface Project {
  id: string;
  name: string;
}

const AssignTaskForm: React.FC = () => {
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("in-progress");
  const [dueDate, setDueDate] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [assignedToId, setAssignedToId] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the user ID based on the email entered
  const fetchUserIdByEmail = async (email: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/users?email=${email}`);
      const user = (response.data as { id: string }[])[0]; // Assuming the API returns an array of users
      if (user && user.id) {
        setAssignedToId(user.id); // Set the user ID based on the email
        setError(null);
      } else {
        setError("User not found.");
      }
      setLoading(false);
    } catch (error) {
      setError("Error fetching user ID.");
      setLoading(false);
    }
  };

  // Fetch available projects from API
  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:3000/projects");
      setProjects(response.data as Project[]); 
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  // Handle form submission to assign task
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignedToId) {
      setError("Please enter a valid email.");
      return;
    }

    if (!selectedProjectId) {
      setError("Please select a valid project.");
      return;
    }

    const newTask = {
      description: taskDescription,
      status,
      dueDate,
      projectId: selectedProjectId, // Automatically set based on project selection
      assignedToId, // Automatically set based on email
    };

    try {
      await axios.post("http://localhost:3000/tasks", newTask);
      alert("Task successfully assigned!");
      // Clear the form
      setTaskDescription("");
      setStatus("in-progress");
      setDueDate("");
      setEmail("");
      setAssignedToId(null);
      setSelectedProjectId(null);
    } catch (error) {
      setError("Error assigning task.");
    }
  };

  // Fetch user ID whenever the email changes
  useEffect(() => {
    if (email) {
      fetchUserIdByEmail(email);
    }
  }, [email]);

  // Fetch the list of projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="form-container">
      <h2>Assign Task to Team Member</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="description">Task Description</label>
          <input
            type="text"
            id="description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="waiting">Waiting</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="project">Select Project</label>
          <select
            id="project"
            value={selectedProjectId || ""}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            required
          >
            <option value="" disabled>Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="email">Assign to (Email)</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {loading && <p>Loading user...</p>}
          {error && <p className="error">{error}</p>}
        </div>

        <button type="submit" disabled={loading || !assignedToId}>
          Assign Task
        </button>
      </form>
    </div>
  );
};

export default AssignTaskForm;
