import { useEffect, useState } from "react";
import {
  FinalResponseIcon,
  HighlightedFieldVisitIcon,
  HighlightedFinalResponseIcon,
  HighlightedLetterIcon,
  HighlightedPetitionIcon,
  MenuIcon,
  NavFieldVisitIcon,
  NavLetterIcon,
  PetitionIcon,
  DashboardIcon,
  HighLightedDashboardIcon,
  FeedbackIcon,
  HighlightedFeedbackIcon,
} from "../../../assets/icons";
import { RouteUrls } from "../../../constants/routes";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { hasPermission } from "../../../utils/PermissionUtils";

const NavConfig = () => {
  const {
    petitionListUrl,
    fieldVisitUrl,
    letterUrl,
    listUrl,
    finalResponseUrl,
    dashboardUrl,
    reportUrl,
  } = RouteUrls;

  const { authUser } = useSelector((state: RootState) => state.auth) as any;

  return [
    {
      title: "Dashboard",
      path: dashboardUrl,
      icon: <DashboardIcon />,
      activeIcon: <HighLightedDashboardIcon />,
      // hasPermission: hasPermission(authUser?.permission, "Dashboard"),
      hasPermission: true,
    },
    {
      title: "Petitions",
      path: `${petitionListUrl}${listUrl}`,
      icon: <PetitionIcon />,
      activeIcon: <HighlightedPetitionIcon />,
      // hasPermission: authUser.permission
      //   ? hasPermission(authUser?.permission, "Restaurant")
      //   : false,
      hasPermission: true,
    },
    {
      title: "Field Visit",
      path: `${fieldVisitUrl}${listUrl}`,
      icon: <NavFieldVisitIcon />,
      activeIcon: <HighlightedFieldVisitIcon />,
      // hasPermission: authUser.permission
      //   ? hasPermission(authUser?.permission, "Restaurant")
      //   : false,
      hasPermission: true,
    },
    {
      title: "Letter",
      path: `${letterUrl}${listUrl}`,
      icon: <NavLetterIcon />,
      activeIcon: <HighlightedLetterIcon />,
      // hasPermission: authUser.permission
      //   ? hasPermission(authUser?.permission, "Restaurant")
      //   : false,
      hasPermission: true,
    },
    {
      title: "Final Response",
      path: `${finalResponseUrl}${listUrl}`,
      icon: <FinalResponseIcon />,
      activeIcon: <HighlightedFinalResponseIcon />,
      // hasPermission: authUser.permission
      //   ? hasPermission(authUser?.permission, "Restaurant")
      //   : false,
      hasPermission: true,
    },
    {
      title: "Report",
      path: reportUrl,
      icon: <FeedbackIcon />,
      activeIcon: <HighlightedFeedbackIcon />,
      hasPermission: true,
    },
  ];
};
export default NavConfig;
