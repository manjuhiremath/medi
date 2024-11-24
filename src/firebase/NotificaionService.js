import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';


const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        const notificationsData = await fetchNotifications();
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error loading notifications: ', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const addNotification = async (title, description) => {
    setLoading(true);
    try {

      await addDoc(collection(db, 'Notification'), {
        title,
        description,
      });

      const notificationsData = await fetchNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error adding notification: ', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'Notification'));
      setLoading(false);

      return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    } catch (error) {
      console.error('Error fetching notifications: ', error);
      return [];
    }

  };

  const deleteNotification = async (id, imageUrl) => {
    try {
      await deleteDoc(doc(db, 'Notification', id));
      const notificationsData = await fetchNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error deleting notification: ', error);
    }
  };

  async function fetchAndSendNotifications(titleValue, descriptionValue) {
    try {
      const response = await fetch('https://send-notification-5h2lms6upq-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: titleValue,
            description: descriptionValue,
          })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Notification sent successfully:', data);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        addNotification,
        deleteNotification,
        fetchAndSendNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);