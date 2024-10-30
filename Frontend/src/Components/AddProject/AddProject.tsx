import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./AddProject.css";

// Debounce Hook to delay updating the search results
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const AddProjectForm: React.FC = () => {
  const { user } = useAuth();
  const [projectName, setProjectName] = useState<string>("");
  const [teamId, setTeamId] = useState<string>("");
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 
  const [successMessage, setSuccessMessage] = useState<string | null>(null); 
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:3500/api/teams");
        if (response.ok) {
          const data = await response.json();
          setTeams(data); 
        } else {
          throw new Error("Failed to fetch teams");
        }
      } catch (error: any) {
        setError(error.message || "Error fetching teams.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const newProject = {
      name: projectName,
      teamId: teamId,
    };

    try {
      // Send POST request to the API to add the project
      const response = await fetch("http://localhost:3500/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        alert("Project added successfully!");
        setSuccessMessage("Project added successfully!"); 
    
        setProjectName("");
        setTeamId("");
      } else {
        throw new Error("Failed to add the project. Please try again.");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      setError((error as Error).message || "An error occurred. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading teams...</p>;
  }
  if (!user || user.role !== "admin") {
    return <p>You do not have permission to create a project.</p>;
  }

  return (
    <div>
      <h2>Add New Project</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="add-project-form">
        <div className="project-name">
          <label htmlFor="projectName">Project Name:</label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          <label htmlFor="teamId">Select Team:</label>
          <input
            type="text"
            placeholder="Search for a team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            id="teamId"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            required
          >
            <option value="">Select a team</option>
            {filteredTeams.map((team) => (
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
