import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"; 
import "./CreateTeamForm.css";

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

interface User {
  id: string;
  name: string;
  email: string;
  password: string; 
  role: string;
}

const CreateTeamForm: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Debounce the search term to reduce unnecessary re-renders
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
          // throw new Error("Failed to fetch users.");
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching users.");
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on the debounced search term
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Handle adding members to the team
  const addMember = (user: User) => {
    if (!selectedMembers.includes(user)) {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  // Handle removing members from the team
  const removeMember = (userId: string) => {
    setSelectedMembers(selectedMembers.filter((member) => member.id !== userId));
  };

  // Handle form submission to create a new team
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Create the new team object including the logged-in user's ID as adminId
    const newTeam = {
      name: teamName,
      description: description,
      members: selectedMembers.map((member) => member.id),
      adminId: user?.id, // Include adminId as the logged-in user’s ID
    };

    try {
      const response = await fetch("http://localhost:3000/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTeam),
      });

      if (!response.ok) {
        throw new Error("Failed to create team.");
      }

      const data = await response.json();
      console.log("New team created:", data);

      setSuccessMessage("Team created successfully!");
      setTeamName("");
      setDescription("");
      setSelectedMembers([]);
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the team.");
    } finally {
      setLoading(false);
    }
  };

  // Render form if user is admin, otherwise show "Access Denied" message
  if (!user || user.role !== "admin") {
    return <p>You do not have permission to create a team.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="create-team-form">
      <div className="form-group">
        <label htmlFor="teamName">Team Name:</label>
        <input
          type="text"
          id="teamName"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="searchMembers">Select Members:</label>
        <input
          type="text"
          id="searchMembers"
          placeholder="Search by email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="user-list">
          {filteredUsers.map((user) => (
            <li key={user.id} onClick={() => addMember(user)}>
              {user.email} ({user.name})
            </li>
          ))}
        </ul>
      </div>

      <div className="selected-members">
        <h4>Selected Members:</h4>
        <ul>
          {selectedMembers.map((member) => (
            <li key={member.id}>
              {member.name} ({member.email}){" "}
              <span
                className="remove-member"
                onClick={() => removeMember(member.id)}
              >
                &times; {/* X for removing */}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? "Creating Team..." : "Create Team"}
      </button>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </form>
  );
};

export default CreateTeamForm;
