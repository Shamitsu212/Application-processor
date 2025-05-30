import { Navigate } from 'react-router-dom';

function ProtectedRoute({ isAuthentificated, children }) {
  if (!isAuthentificated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProtectedRoute;