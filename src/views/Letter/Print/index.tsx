import { Box, Divider, Grid, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import moment from "moment";

const PrintForm = ({ printRef, letterInfo }: any) => {
  //   const { printRef } = props;
  //   const { authUser } = useSelector((state: RootState) => state.auth) as any;
  const tempElement = document.createElement("div");
  tempElement.innerHTML = letterInfo?.content;

  // Find the content within div id="letterContent"
  const letterContentDiv = tempElement.querySelector("#letterContent");

  // If found, get its inner HTML; otherwise, use initialHtml
  const content = letterContentDiv ? letterContentDiv.innerHTML : "";

  const sanitizedContent = DOMPurify.sanitize(content);
  return (
    <Box
      ref={printRef}
      sx={{
        marginLeft: "25px",
        marginRight: "25px",
        fontFamily: "SanSerif",
      }}
    >
      <Box
        sx={{ height: letterInfo.type == "Party Letter" ? "110px" : "125px" }}
      ></Box>

      <Box>
        <Box dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </Box>
      {/* <Box sx={{ height: "30px" }}></Box> */}
    </Box>
  );
};

export default PrintForm;
