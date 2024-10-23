import React, { useState, useEffect } from "react";
import axios from "axios";
import './AssignTask.css';

interface Project {
  id: string;
  name: string;
  teamId: string;
}

interface Team {
  id: string;
  name: string;
  members?: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AssignTaskForm: React.FC = () => {
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("in-progress");
  const [dueDate, setDueDate] = useState<string>("");
  const [] = useState<string>("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [assignedToId, setAssignedToId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [userDetails, setUserDetails] = useState<{ [key: string]: User }>({}); // State to hold user details

  const [] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available projects from API
  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:3000/projects");
      setProjects(response.data as Project[]);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  // Fetch available teams from API
  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:3000/teams");
      setTeams(response.data as Team[]);
    } catch (error) {
      console.error("Error fetching teams", error);
    }
  };

  // Fetch users to map member IDs to user details
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      const users = response.data as User[];
      const userDetailsMap: { [key: string]: User } = {};
      users.forEach(user => {
        userDetailsMap[user.id] = user; // Map user ID to user details
      });
      setUserDetails(userDetailsMap);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  // Fetch team members based on the selected project
  const fetchTeamMembers = () => {
    if (selectedProjectId) {
      const selectedProject = projects.find(project => project.id === selectedProjectId);
      if (selectedProject) {
        const team = teams.find(team => team.id === selectedProject.teamId);
        if (team && team.members) {
          setTeamMembers(team.members);
        } else {
          setTeamMembers([]);
        }
      }
    }
  };

  // Handle form submission to assign task
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignedToId) {
      setError("Please select a valid team member.");
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
      projectId: selectedProjectId,
      assignedToId,
    };

    try {
      await axios.post("http://localhost:3000/tasks", newTask);
      alert("Task successfully assigned!");
      // Clear the form
      setTaskDescription("");
      setStatus("in-progress");
      setDueDate("");
      setAssignedToId(null);
      setSelectedProjectId(null);
      setTeamMembers([]);
    } catch (error) {
      setError("Error assigning task.");
    }
  };

  // Fetch the list of projects, teams, and users on component mount
  useEffect(() => {
    fetchProjects();
    fetchTeams();
    fetchUsers();
  }, []);

  // Fetch team members whenever the selected project changes
  useEffect(() => {
    fetchTeamMembers();
  }, [selectedProjectId]);

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
          <label htmlFor="member">Assign to (Email)</label>
          <select
            id="member"
            value={assignedToId || ""}
            onChange={(e) => setAssignedToId(e.target.value)}
            required
          >
            <option value="" disabled>Select a member</option>
            {teamMembers.map((memberId) => {
              const user = userDetails[memberId]; // Get user details for the member
              return (
                <option key={memberId} value={memberId}>
                  {user ? `${user.email} (${user.name})` : memberId} {/* Display email and name */}
                </option>
              );
            })}
          </select>
          {error && <p className="error">{error}</p>}
        </div>

        <button type="submit">
          Assign Task
        </button>
      </form>
    </div>
  );
};

export default AssignTaskForm;
