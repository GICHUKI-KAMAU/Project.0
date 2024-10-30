import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AssignTask.css";

interface Project {
  team_ID: string;
  xata_id: string;
  id: string;
  name: string;
  teamId: string;
}

interface Team {
  xata_id: string;
  id: string;
  name: string;
  members?: string[];
}

interface User {
  username: string;
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
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [assignedToId, setAssignedToId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [userDetails, setUserDetails] = useState<{ [key: string]: User }>({});

  const [] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:3500/api/projects");
      setProjects(response.data as Project[]);
      console.log("the projects are", response.data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:3500/api/teams");
      setTeams(response.data as Team[]);
      console.log("the teams are", response.data);
    } catch (error) {
      console.error("Error fetching teams", error);
    }
  };

  // Fetch users to map member IDs to user details
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3500/api/auth/users");
      const users = response.data as User[];
      const userDetailsMap: { [key: string]: User } = {};
      users.forEach((user) => {
        userDetailsMap[user.id] = user;
      });
      setUserDetails(userDetailsMap);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  // Fetch team members based on the selected project
  const fetchTeamMembers = () => {
    if (selectedProjectId) {
      const selectedProject = projects.find(
        (project) => project.xata_id === selectedProjectId
      );

      if (selectedProject && selectedProject.team_ID) {
        const teamId = selectedProject.team_ID.xata_id;

        const team = teams.find((team) => team.xata_id === teamId);

        if (team && team.members) {
          setTeamMembers(team.members);
        } else {
          console.log("No team found for the selected project.");
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
      await axios.post("http://localhost:3500/api/tasks", newTask);
      
      alert("Task successfully assigned!");
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

  useEffect(() => {
    fetchProjects();
    fetchTeams();
    fetchUsers();
  }, []);

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
            <option value="" disabled>
              Select a project
            </option>
            {projects.map((project) => (
              <option key={project.xata_id} value={project.xata_id}>
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
            <option value="" disabled>
              Select a member
            </option>
            {teamMembers.map((memberUsername) => {
              const user = Object.values(userDetails).find(
                (u) => u.username === memberUsername
              ); 

              return (
                <option key={memberUsername} value={user?.id || memberUsername}>
                  {user ? `${user.email} (${user.username})` : memberUsername}
                </option>
              );
            })}
          </select>
          {error && <p className="error">{error}</p>}
        </div>

        <button type="submit">Assign Task</button>
      </form>
    </div>
  );
};

export default AssignTaskForm;
