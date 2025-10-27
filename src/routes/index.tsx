import { RouteUrls } from "../constants/routes";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import SignIn from "../views/Auth";
import Error from "../views/Error";
import Petitions from "../views/Petitions";
import PetitionsAddAndEdit from "../views/Petitions/AddAndEdit";
import { hasPermission } from "../utils/PermissionUtils";
import FieldVisit from "../views/FieldVisit";
import FieldVisitAddAndEdit from "../views/FieldVisit/AddAndEdit";
import Letter from "../views/Letter";
import LetterAddAndEdit from "../views/Letter/AddAndEdit";
import FinalResponse from "../views/FinalResponse";
import AddAndEditFinalResponse from "../views/FinalResponse/AddAndEdit";
import LetterEditor from "../views/Letter/LetterEditor";
import Dashboard from "../views/Dashboard";
import Report from "../views/Report";

const Routes = () => {
  const { authUser } = useSelector((state: RootState) => state.auth) as any;

  const {
    signInUrl,
    petitionListUrl,
    createUrl,
    editUrl,
    fieldVisitUrl,
    viewUrl,
    letterUrl,
    listUrl,
    finalResponseUrl,
    letterEditorUrl,
    dashboardUrl,
    reportUrl,
  } = RouteUrls;

  const privateRoutes = [
    // {
    //   path: "*",
    //   Component: <Error />,
    // },
    {
      path: `${petitionListUrl}${listUrl}`,
      Component: <Petitions />,
    },
    {
      path: `${petitionListUrl}${createUrl}`,
      Component: <PetitionsAddAndEdit />,
    },
    {
      path: `${petitionListUrl}/:id`,
      Component: <PetitionsAddAndEdit />,
    },
    {
      path: `${fieldVisitUrl}${listUrl}`,
      Component: <FieldVisit />,
    },
    {
      path: `${fieldVisitUrl}${createUrl}`,
      Component: <FieldVisitAddAndEdit />,
    },
    {
      path: `${fieldVisitUrl}/:id`,
      Component: <FieldVisitAddAndEdit />,
    },
    {
      path: `${letterUrl}${listUrl}`,
      Component: <Letter />,
    },
    {
      path: `${letterUrl}${createUrl}`,
      Component: <LetterAddAndEdit />,
    },
    {
      path: `${letterUrl}/:id`,
      Component: <LetterAddAndEdit />,
    },
    {
      path: `${letterUrl}${letterEditorUrl}/:id`,
      Component: <LetterEditor />,
    },
    {
      path: `${letterUrl}${letterEditorUrl}/:id/:letterFormatId`,
      Component: <LetterEditor />,
    },
    // {
    //   path: `${letterEditorUrl}/:letterFormatId`,
    //   Component: <LetterEditor />,
    // },
    {
      path: `${finalResponseUrl}${listUrl}`,
      Component: <FinalResponse />,
    },
    {
      path: `${finalResponseUrl}${createUrl}`,
      Component: <AddAndEditFinalResponse />,
    },
    {
      path: `${finalResponseUrl}/:id`,
      Component: <AddAndEditFinalResponse />,
    },

    {
      path: dashboardUrl,
      Component: <Dashboard />,
    },
    {
      path: reportUrl,
      Component: <Report />,
    },

    // {
    //   path: `${restaurantUrl}`,
    //   Component: authUser.permission ? (
    //     hasPermission(authUser.permission, "Restaurant") ? (
    //       <RestaurantBillList />
    //     ) : (
    //       <Error />
    //     )
    //   ) : (
    //     <RestaurantBillList />
    //   ),
    // },
  ];

  const publicRoutes = [
    {
      path: signInUrl,
      Component: <SignIn />,
    },
  ];

  return { privateRoutes, publicRoutes };
};

export default Routes;
