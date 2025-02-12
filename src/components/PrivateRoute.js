import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { token } = useSelector(state => state.auth);

    return token ? (children || <Outlet />) : <Navigate to="/login" />;
};

export default PrivateRoute;
