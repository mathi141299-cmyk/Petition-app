import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
} from "@mui/material";
import { DeleteAlertIcon } from "../../../assets/icons";
import { Button } from "../../basic";
import DeleteButton from "../../basic/button/deleteButton";
import CancelButton from "../../basic/button/cancelButton";
// import { CancelButton } from "../../basic/button/cancelButton";

type DialogProps = {
  children?: React.ReactNode;
  onClose: () => void;
  handleClick: () => void;
  open: boolean;
  fullWidth?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  title: string;
  confirmText?: string;
  cancelText?: string;
  type?: string;
  loading?: boolean;
  width?: any;
};
const Transition = React.forwardRef(function Transition(props: any, ref: any) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function ConfirmationDialog({
  children,
  onClose,
  handleClick,
  open,
  fullWidth = true,
  maxWidth = "xs",
  title = "",
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "confirmation",
  loading,
  width,
}: DialogProps) {
  const styles = {
    dialogTitle: {
      width: width ? width : "auto",
      fontSize: "14px",
      fontWeight: "400",
    },
    defaultButton: { width: "110px", height: "36px", mr: "10px" },
    dialogContent: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      p: "10px 20px",
    },
    dialogAction: {
      display: "flex",
      justifyContent: "flex-start",
      p: "10px 20px",
    },
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={onClose}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiPaper-root": {
            position: "absolute",
            top: "0px",
            height: "180px",
          },
        }}
      >
        <DialogContent sx={{ ...styles.dialogContent }}>
          {type === "confirmation" ? (
            <DeleteAlertIcon width="19px" height="19px" />
          ) : null}
          <DialogTitle id="alert-dialog-title" sx={{ ...styles.dialogTitle }}>
            {title}
          </DialogTitle>
        </DialogContent>
        <DialogActions sx={{ ...styles.dialogAction }}>
          {type === "confirmation" ? (
            <>
              {confirmText === "Delete" && (
                <DeleteButton
                  handleClick={handleClick}
                  buttonText={confirmText}
                  loading={loading}
                  sx={{ ...styles.defaultButton }}
                />
              )}
              {confirmText !== "Delete" && (
                <Button
                  loading={loading}
                  buttonText={confirmText}
                  onClick={handleClick}
                  sx={{ ...styles.defaultButton, fontSize: 14 }}
                />
              )}
              <CancelButton
                handleClick={onClose}
                buttonText={cancelText}
                sx={{ ...styles.defaultButton }}
              />
            </>
          ) : null}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
