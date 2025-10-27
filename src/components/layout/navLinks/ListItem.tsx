import React from "react";
import { useLocation } from "react-router";
import { ListItemButton, ListItemIcon } from "@mui/material";
import NavConfig from "./NavConfig";
import { setMobileOpen } from "../../../redux/slices/layout";
import { AppDispatch } from "../../../redux/store";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { Link } from "react-router-dom";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
  minHeight: "0px",
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({}));

function MainListItems() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [expanded, setExpanded] = React.useState<string | false>("panel1");
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const navConfig = NavConfig();

  return (
    <React.Fragment>
      {navConfig.map((nav: any, index: number) => {
        if (!nav.children) {
          if (nav.hasPermission) {
            return (
              <Link
                to={nav.path}
                key={index}
                style={{
                  textDecoration: "none",
                }}
              >
                <ListItemButton
                  key={index}
                  disableRipple={true}
                  sx={{
                    maxWidth: "256px",
                    minHeight: "0px",
                    height: "40px",
                    borderRadius: "5px",
                    m: "15px 4px 25px 6px",
                    display: "flex",
                    // "&::before": {
                    //   content: `"«"`,
                    //   position: "absolute",
                    //   top: 0,
                    //   left: "-10px",
                    //   color: "primary.main",
                    //   height: "40px",
                    //   width: "20px",
                    //   backgroundColor: "primary.main",
                    // },
                    flexDirection: "row",
                    ...(location.pathname === nav.path
                      ? { background: "#FFF2E7" }
                      : { background: "transparent" }),
                  }}
                  onClick={() => {
                    dispatch(setMobileOpen(false));
                    setExpanded("noPanel");
                  }}
                >
                  <ListItemIcon sx={{ color: "#7F7F7F" }}>
                    {location.pathname === nav.path ? nav.activeIcon : nav.icon}
                  </ListItemIcon>
                  <Typography
                    sx={{
                      color:
                        location.pathname === nav.path
                          ? "primary.main"
                          : "#6B7280",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    {nav.title}
                  </Typography>
                </ListItemButton>
              </Link>
            );
          }
        }

        if (nav.children) {
          if (nav.hasPermission) {
            return (
              <Grid
                className="nav-with-children"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  m: "15px 4px 25px 6px",
                  width: "256px",
                  "& .MuiAccordionSummary-root": {
                    minHeight: "0px",
                    height: "40px",
                    width: "256px",
                    p: "0px 10px 0px 16px",
                  },

                  "& .MuiAccordionDetails-root": {
                    p: "0 0 0 25px",
                    m: "0 0 0 25px",
                    width: "209",
                    borderLeft: 2,
                    borderColor: "#D9D9D9",
                  },

                  "& .MuiCollapse-entered": {
                    display: "block",
                    transition: "display 8s linear 5s",
                  },
                  "& .MuiCollapse-hidden": {
                    display: "none",
                    transition: "display 8s linear 5s",
                  },

                  "&.Mui-expanded": {
                    display: "block",
                    transition: "display 8s linear 5s",
                  },
                  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                    transform: "rotate(90deg)",
                  },
                  "& .MuiCollapse-wrapperInner": {
                    backgroundColor: "#F9FBF9",
                  },
                }}
              >
                <Accordion
                  className="accordion"
                  expanded={expanded === `${nav.title}`}
                  onChange={handleChange(`${nav.title}`)}
                >
                  <Grid
                    className="accordion-summary(title)-grid"
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                      borderRadius: "5px",
                      width: "256px",
                      position: "relative",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      backgroundColor: "#F9FBF9",
                    }}
                  >
                    <AccordionSummary
                      className="accordion-summary"
                      expandIcon={
                        <KeyboardArrowRightIcon
                          sx={{
                            color: nav.children.some((child: any) =>
                              location.pathname.includes(nav.path + child.path)
                            )
                              ? "primary.main"
                              : "initial",
                            width:
                              expanded === `${nav.title}` ? "20px" : "24px",
                            height:
                              expanded === `${nav.title}` ? "20px" : "26px",
                          }}
                        />
                      }
                      sx={{
                        borderRadius: "5px",
                        background: nav.children.some((child: any) =>
                          location.pathname.includes(nav.path + child.path)
                        )
                          ? "primary.light"
                          : "initial",
                      }}
                    >
                      <Grid
                        className="inner-accordion-summary"
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <ListItemIcon sx={{ color: "black" }}>
                          {nav.children.some((child: any) =>
                            location.pathname.includes(nav.path + child.path)
                          )
                            ? nav.activeIcon
                            : nav.icon}
                        </ListItemIcon>
                        <Typography
                          sx={{
                            color: nav.children.some((child: any) =>
                              location.pathname.includes(nav.path + child.path)
                            )
                              ? "primary.main"
                              : "#6B7280",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {nav.title}
                        </Typography>
                      </Grid>
                    </AccordionSummary>
                  </Grid>
                  <AccordionDetails className="accordion-detail">
                    {nav.children.map((navChild: any, index: number) => {
                      if (navChild.hasPermission) {
                        return (
                          <Link
                            to={nav.path + navChild.path}
                            key={index}
                            style={{
                              textDecoration: "none",
                              cursor: "pointer",
                            }}
                            className="accordion-summary-child"
                          >
                            <ListItemButton
                              key={index}
                              disableRipple={true}
                              sx={{
                                minHeight: "0px",
                                height: "40px",
                                borderRadius: "5px",
                                m: "12px 10px 0px 6px",
                                display: "flex",
                                flexDirection: "row",
                                width: "180px",
                                position: "relative",
                                justifyContent: "flex-start",
                                background:
                                  location.pathname === nav.path + navChild.path
                                    ? "primary.light"
                                    : "initial",
                              }}
                            >
                              <Typography
                                sx={{
                                  color:
                                    location.pathname ===
                                    nav.path + navChild.path
                                      ? "primary.main"
                                      : "#6B7280",
                                  fontSize: "13px",
                                  fontWeight:
                                    location.pathname ===
                                    nav.path + navChild.path
                                      ? "500"
                                      : "400",
                                }}
                              >
                                {navChild.title}
                              </Typography>
                            </ListItemButton>
                          </Link>
                        );
                      }
                    })}
                  </AccordionDetails>
                </Accordion>
              </Grid>
            );
          }
        }
      })}
    </React.Fragment>
  );
}

export default MainListItems;
