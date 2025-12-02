import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";


interface Props {
  allowedRoles: string[]; 
}

const RequireAuth = ({ allowedRoles }: Props) => {

  const { token, userRole } = useSelector((state: RootState) => state.auth);
  const location = useLocation();


  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

 
  const userRolesArray = Array.isArray(userRole) ? userRole : [userRole || ""];


  const hasPermission = userRolesArray.some(role => allowedRoles.includes(role));

  if (!hasPermission) {

    return (
        <div className="container mt-5 text-center">
            <div className="alert alert-danger p-5 shadow-sm">
                <h1 className="display-1"><i className="bi bi-shield-lock-fill"></i></h1>
                <h2 className="fw-bold">Erişim Engellendi!</h2>
                <p className="lead">Ciğerim, bu sayfayı görmeye yetkin yetmiyor. Yöneticinle görüşmelisin.</p>
                <a href="/" className="btn btn-outline-danger mt-3">Anasayfaya Dön</a>
            </div>
        </div>
    );
  }

  return <Outlet />;
};

export default RequireAuth;