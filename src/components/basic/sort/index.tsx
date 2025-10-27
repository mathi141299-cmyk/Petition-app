import {
  ArrowDownIcon,
  ArrowUpIcon,
  SelectedDownArrow,
  SelectedUpArrow,
} from "../../../assets/icons";
import { Box } from "@mui/material";

type SortPropsTypes = {
  ascendingOnClick?: any;
  descendingOnClick?: any;
  descendingActive?: boolean;
  ascendingActive?: boolean;
};
export default function SortComponent({
  ascendingOnClick,
  descendingOnClick,
  descendingActive,
  ascendingActive,
}: SortPropsTypes) {
  return (
    <Box sx={{ display: "grid", margin: "10px", gap: "3px" }}>
      {ascendingActive ? (
        <SelectedUpArrow
          onClick={ascendingOnClick}
          style={{
            cursor: "pointer",
            marginLeft: "1px",
          }}
        />
      ) : (
        <ArrowUpIcon
          onClick={ascendingOnClick}
          style={{
            cursor: "pointer",
            marginLeft: "1px",
          }}
        />
      )}
      {descendingActive ? (
        <SelectedDownArrow
          onClick={descendingOnClick}
          style={{
            cursor: "pointer",
            marginLeft: "1px",
            color:"red !important"
          }}
        />
      ) : (
        <ArrowDownIcon
          onClick={descendingOnClick}
          style={{
            cursor: "pointer",
            marginLeft: "1px",
          }}
        />
      )}
    </Box>
  );
}
