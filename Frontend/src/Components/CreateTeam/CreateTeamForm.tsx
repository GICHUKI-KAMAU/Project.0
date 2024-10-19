import React, { useState } from "react";
import "./CreateTeamForm.css";
import mockData from "../MockData/mock.json";

// Simulated logged-in user data (in a real app, you'd get this from authentication)
const loggedInUser = {
  id: "1", // This represents the logged-in user’s ID
  name: "John Doe",
  email: "johndoe@example.com",
};

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const CreateTeamForm: React.FC = () => {
  const users: User[] = mockData.users;

  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter users based on the search term
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
      adminId: loggedInUser.id, // Include adminId as the logged-in user’s ID
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
