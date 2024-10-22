import React, { useState, useEffect } from 'react';

interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
}

interface Task {
  id: string;
  description: string;
  dueDate: string; // Assuming dueDate is a string in ISO format
  assignedToId: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('1'); // Assuming user ID 1 is the logged-in user

  // Fetch tasks and notifications from API
  useEffect(() => {
    const fetchTasksAndNotifications = async () => {
      try {
        // Fetch tasks
        const taskResponse = await fetch('http://localhost:3000/tasks');
        if (!taskResponse.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const tasks: Task[] = await taskResponse.json();

        // Check for tasks due tomorrow and notify for assignments
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const notificationsList: Notification[] = [];

        // Loop through tasks to find those due tomorrow and assignments
        tasks.forEach(task => {
          const dueDate = new Date(task.dueDate);
          // Notify for tasks due tomorrow
          if (dueDate.toDateString() === tomorrow.toDateString() && task.assignedToId === userId) {
            notificationsList.push({
              id: task.id,
              userId,
              message: `One day to the due date of task: "${task.description}"`,
              isRead: false,
            });
          }
          // Notify for newly assigned tasks
          if (task.assignedToId === userId) {
            notificationsList.push({
              id: task.id + '-assigned', // Unique ID for assigned task notifications
              userId,
              message: `You have been assigned a new task: "${task.description}"`,
              isRead: false,
            });
          }
        });

        // Fetch existing notifications
        const notificationResponse = await fetch('http://localhost:3000/notifications');
        if (!notificationResponse.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const existingNotifications: Notification[] = await notificationResponse.json();
        
        // Combine existing notifications with new ones
        setNotifications([...existingNotifications.filter(notification => notification.userId === userId), ...notificationsList]);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasksAndNotifications();
  }, [userId]);

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/notifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        setNotifications(notifications.map(notification =>
          notification.id === id ? { ...notification, isRead: true } : notification
        ));
      } else {
        alert('Failed to mark notification as read.');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      alert('Error occurred while marking the notification as read.');
    }
  };

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="notifications-page">
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map(notification => (
            <li
              key={notification.id}
              className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
            >
              <p>{notification.message}</p>
              {!notification.isRead && (
                <button onClick={() => markAsRead(notification.id)}>Mark as read</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
