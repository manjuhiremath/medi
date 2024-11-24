import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../firebase/AuthContext'; // Adjust the import based on your file structure

const ProtectedRoute = ({ children }) => {
  const { isLoggedin } = useContext(AuthContext);

  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;