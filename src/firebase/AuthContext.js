import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { setPersistence, signInWithEmailAndPassword, browserSessionPersistence, signOut } from 'firebase/auth';
import { useRouter } from '../routes/hooks';
import { auth, db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import AuthError from '../_mock/error';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();


  const fetchDocument = async () => {
    try {
      const collectionRef = collection(db, "admin-users");
      const querySnapshot = await getDocs(collectionRef);
      const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (documents.length > 0) {
        return documents;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(true);
      if (user) {
        const adminData = await fetchDocument();
        if (adminData) {
          setUser(user);
          setIsLoggedin(true);
        } else {
          setUser(null);
          setIsLoggedin(false);
        }
      } else {
        setUser(null);
        setIsLoggedin(false);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {

    try {
      setLoading(true);
      setError('');
      await setPersistence(auth, browserSessionPersistence);
      const Admin = await signInWithEmailAndPassword(auth, email, password);
      const userId = Admin.user.uid;
      const adminData = await fetchDocument();
      const admin = adminData[0].id;
      if (userId === admin) {
        setUser(Admin.user);
        setIsLoggedin(true);
        router.push('/hospitals');
      } else {
        setError('Access denied. Not an admin.');
        router.push('/login');
      }
    } catch (error) {
      setError(AuthError(error));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (isLoggedin) {
        setLoading(true);
        await signOut(auth);
        setUser(null);
        setIsLoggedin(false);
        router.push('/login');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error, setError, isLoggedin }}>
      {children}
    </AuthContext.Provider>
  );
};
