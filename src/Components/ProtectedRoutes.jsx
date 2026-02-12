import { Navigate } from 'react-router-dom';
import useAuthStore from '../Store/AuthStore';


// только для авторизованных
export function ProtectedRoute({ children }) {
  const isAuth = useAuthStore((s) => s.isAuth);

  if (!isAuth) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}


// только для неавторизованных
export function ProtectedAuthRoute({ children }) {
  const isAuth = useAuthStore((s) => s.isAuth);

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
}

