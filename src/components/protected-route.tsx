import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';
import { selectIsAuthChecked, selectUser } from '../services/slices/authSlice';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

const ProtectedRoute: FC<ProtectedRouteProps> = ({ onlyUnAuth }) => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Скрыть страницу от авторизованных пользователей
  if (onlyUnAuth && user) {
    return <Navigate to={location.state?.from || { pathname: '/' }} replace />;
  }

  // Редирект на логин
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
