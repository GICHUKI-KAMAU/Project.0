import React, { useEffect, useState } from "react";
import "./AddProject.css";

const AddProjectForm: React.FC = () => {
  // State to hold the form input values
  const [projectName, setProjectName] = useState<string>("");
  const [teamId, setTeamId] = useState<string>("");
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]); // State for teams

  // Fetch teams from the API when the component mounts
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:3000/teams");
        if (response.ok) {
          const data = await response.json();
          setTeams(data); // Set the teams state with the fetched data
        } else {
          console.error("Failed to fetch teams");
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []); // Empty dependency array to run only once

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construct the project data
    const newProject = {
      name: projectName,
      teamId: teamId,
    };

    try {
      // Send POST request to the API to add the project
      const response = await fetch("http://localhost:3000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        alert("Project added successfully!");
        // Optionally, reset the form
        setProjectName("");
        setTeamId("");
      } else {
        alert("Failed to add the project. Please try again.");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit} className="add-project-form">
        <div>
          <label htmlFor="projectName">Project Name:</label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="teamId">Select Team:</label>
          <select
            id="teamId"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            required
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default AddProjectForm;
