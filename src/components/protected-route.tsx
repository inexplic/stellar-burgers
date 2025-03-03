import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';
import { selectIsAuthChecked, selectUser } from '../services/slices/authSlice';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

const ProtectedRoute: FC<ProtectedRouteProps> = ({ onlyUnAuth, children }) => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to={location.state?.from || { pathname: '/' }} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
