import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "../../basic";
type DialogWrapperProps = {
  children?: React.ReactNode;
  onClose?: () => void;
  handleClick?: () => void;
  open: boolean;
  title?: string;
  fullWidth?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  confirmText?: string | any;
  cancelText?: string;
  loading?: boolean;
  backdropClick?: boolean;
  contentOnly?: boolean;
};

function DialogWrapper({
  children,
  onClose,
  handleClick,
  open,
  fullWidth = true,
  maxWidth = "md",
  title = "",
  loading,
  confirmText,
  backdropClick = false,
  contentOnly = false,
}: DialogWrapperProps) {
  const styles = {
    dialogTitle: { p: "20px 20px" },
    iconButton: { mr: "20px", mt: "8px" },
    dialogAction: {
      display: "flex",
      justifyContent: "flex-start",
      m: "20px 24px",
      p: "0px",
    },
    defaultButton: { width: "450px", height: "51px" },
    dialogContent: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };
  return (
    <Dialog
      id="dialog-wrapper"
      onClose={backdropClick ? onClose : undefined}
      aria-labelledby={`${title}_dialog_title`}
      open={open}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={{
        "& .MuiPaper-root": {
          position: "static",
        },
      }}
    >
      <Grid
        sx={{
          display: "flex",
          justifyContent: title !== "" ? "space-between" : "flex-end",
          alignItems: "center",
        }}
      >
        {title !== "" && (
          <DialogTitle sx={{ ...styles.dialogTitle }}>
            <Typography variant="h2">{title}</Typography>
          </DialogTitle>
        )}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ ...styles.iconButton }}
        >
          <CloseIcon />
        </IconButton>
      </Grid>
      {title !== "" && <Divider light />}

      <DialogContent sx={{ pt: title !== "" ? "" : 0 }}>
        {children}
      </DialogContent>
      {handleClick ? (
        <DialogActions
          sx={{
            ...styles.dialogAction,
          }}
        >
          <Button
            buttonText={confirmText}
            handleClick={handleClick}
            sx={{ ...styles.defaultButton }}
            loading={loading}
          />
        </DialogActions>
      ) : null}
    </Dialog>
  );
}

export default DialogWrapper;
