import { Outlet, Navigate } from "react-router-dom";

type PrivateRoutesTypes = {
  isLoggedIn?: boolean;
};

const PrivateRoutes = ({ isLoggedIn }: PrivateRoutesTypes) => {
  // console.log("isLoggedIn from PrivateRoutes", isLoggedIn);

  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
