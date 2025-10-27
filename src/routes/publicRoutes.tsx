import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { RouteUrls } from "../constants/routes";

type PublicRoutesTypes = {
  isLoggedIn?: boolean;
};

const PublicRoutes = ({ isLoggedIn }: PublicRoutesTypes) => {
  const {
    dashboardUrl,
    signInUrl,
    petitionListUrl,
    createUrl,
    editUrl,
    listUrl,
  } = RouteUrls;

  const { authUser } = useSelector((state: RootState) => state.auth) as any;

  // let initialRoute = "/";

  // const permissionList = authUser?.permission;

  return !isLoggedIn ? <Outlet /> : <Navigate to={dashboardUrl} />;
};

export default PublicRoutes;
