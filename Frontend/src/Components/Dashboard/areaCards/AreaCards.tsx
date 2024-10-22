import React, { useEffect, useState } from "react";
import AreaCard from "./AreaCard";
import axios from "axios"; 
import "./AreaCards.scss";

const AreaCards = () => {
  const [totalProjects, setTotalProjects] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0); // State for total tasks
  const [completedTasks, setCompletedTasks] = useState(0); // State for completed tasks

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get<{ length: number }>("http://localhost:3000/projects");
        setTotalProjects(response.data.length); 
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await axios.get<{ status: string }[]>("http://localhost:3000/tasks");
        const tasks = response.data;

        const inProgressTasks = tasks.filter(task => task.status === "in-progress").length;
        const waitingTasks = tasks.filter(task => task.status === "waiting").length;
        const completedTaskCount = tasks.filter(task => task.status === "completed").length; // Count completed tasks

        const countPendingTasks = inProgressTasks + waitingTasks;
        setPendingTasks(countPendingTasks);
        setTotalTasks(tasks.length); // Update total tasks
        setCompletedTasks(completedTaskCount); // Update completed tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchProjects(); 
    fetchTasks(); 
  }, []); 

  // Calculate the percent fill value for pending tasks
  const percentFillValue = totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0;

  return (
    <section className="content-area-cards">
      <AreaCard
        colors={[]}
        percentFillValue={80}
        cardInfo={{
          title: "Total Projects",
          value: totalProjects.toString(),
          text: "Total number of projects.",
        }}
        showChart={false}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        percentFillValue={percentFillValue} // Use calculated percentage for pending tasks
        cardInfo={{
          title: "Pending Tasks",
          value: pendingTasks.toString(), 
          text: "The number of pending tasks.",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        percentFillValue={(completedTasks / totalTasks) * 100} // Calculate percentage of completed tasks
        cardInfo={{
          title: "Completed Tasks",
          value: completedTasks.toString(), // Use completed tasks count
          text: "All completed Tasks",
        }}
        showChart={false}
      />
    </section>
  );
};

export default AreaCards;
