import MuiAlert, { type AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Slide, { type SlideProps } from "@mui/material/Slide";
import { RootState } from "../../../redux/store";
import { setClearSnackBar } from "../../../redux/slices/snackbar";

type TransitionProps = Omit<SlideProps, "direction">;

function TransitionLeft(props: TransitionProps): JSX.Element {
  return <Slide {...props} direction="left" />;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  const { snackBar } = useSelector((state: RootState) => state.snackBar);
  return (
    <MuiAlert
      elevation={6}
      ref={ref}
      variant="filled"
      {...props}
      sx={{
        color: snackBar.color,
        fontSize: "15px",
        fontWeight: 400,
        backgroundColor: "white",
        borderLeft: `8px solid ${snackBar.borderColor}`,
        fontFamily: "Inter !important",
        boxShadow: "5px 10px 20px 0px rgba(0, 0, 0, 0.10) !important",
      }}
    />
  );
});

const AppSnackBar = (): JSX.Element => {
  const dispatch = useDispatch();
  const { snackBar } = useSelector((state: RootState) => state.snackBar);
  function handleClose(): void {
    dispatch(setClearSnackBar(undefined));
  }

  return (
    <Snackbar
      open={snackBar?.snackBarOpen}
      autoHideDuration={4000}
      onClose={handleClose}
      TransitionComponent={TransitionLeft}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} sx={{ width: "100%" }} icon={snackBar.Icon}>
        {snackBar?.snackBarMessage}
      </Alert>
    </Snackbar>
  );
};

export default AppSnackBar;
