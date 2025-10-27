import React from "react";
import { Grid, Typography } from "@mui/material";
import moment from "moment";

const PetitionPrint = ({ petitionDetails, printRef }: any) => {
  const {
    petitionerName,
    petitionNo,
    mobile,
    habitation,
    isFieldVisitRequired,
    petitionDepartment,
    petitionFieldVisit,
    petitionLetter,
    finalResponsePetition,
    modeOfComplaintDetail,
    receivedByDetail,
    referredBy,
    typeOfIssue,
  } = petitionDetails;

  const departmentNames = petitionDepartment
    ?.map((item: any) => item.department.name)
    .join(", ");

  const lettersName = petitionLetter
    ? petitionLetter?.letter?.letterFormatDetail
        ?.map((letter: any) => letter.name)
        .join(", ")
    : "-";

  const petitionInformation = [
    {
      name: "Petition Number",
      value: petitionNo,
    },
    {
      name: "Petitioner Name",
      value: petitionerName,
    },
    {
      name: "Mobile",
      value: mobile ? mobile : "-",
    },
    {
      name: "Panchayat",
      value: habitation?.panchayat?.name,
    },
    {
      name: "Departments",
      value: departmentNames,
    },
    {
      name: "Mode Of Complaint",
      value: modeOfComplaintDetail?.name ? modeOfComplaintDetail?.name : "-",
    },
    {
      name: "Received By",
      value: receivedByDetail?.name ? receivedByDetail?.name : "-",
    },
    {
      name: "Referred By",
      value: referredBy ? referredBy : "-",
    },
    {
      name: "Type Of Issue",
      value: typeOfIssue ? typeOfIssue : "-",
    },
  ];

  const fieldVisitInformation = [
    {
      name: "Visit Date",
      value: petitionFieldVisit?.fieldVisit?.visitDate
        ? moment(
            petitionFieldVisit?.fieldVisit?.visitDate,
            "YYYY-MM-DD"
          ).format("DD-MM-YYYY")
        : "-",
    },
    {
      name: "Visit By",
      value: petitionFieldVisit?.fieldVisit?.visitBy
        ? petitionFieldVisit?.fieldVisit?.visitBy
        : "-",
    },
    {
      name: "Visit Report",
      value: petitionFieldVisit?.fieldVisit?.visitReport
        ? petitionFieldVisit?.fieldVisit?.visitReport
        : "-",
    },
    {
      name: "status",
      value:
        isFieldVisitRequired === 1
          ? petitionFieldVisit?.fieldVisit?.fieldVisitStatus
          : "Not Required",
    },
  ];

  const letterInformation = [
    {
      name: "Date",
      value: petitionLetter
        ? petitionLetter?.letter?.date
          ? moment(petitionLetter?.letter?.date, "YYYY-MM-DD").format(
              "DD-MM-YYYY"
            )
          : "-"
        : "",
    },
    {
      name: "Status",
      value:
        petitionFieldVisit?.fieldVisit?.isLetterRequired === 1
          ? petitionLetter?.letter?.letterStatus
          : "Not Required",
    },
    {
      name: "Letters Name",
      value: lettersName,
    },
  ];

  const finalResponseInformation = [
    {
      name: "Date",
      value: finalResponsePetition
        ? finalResponsePetition[0]?.finalResponse?.date
          ? moment(
              finalResponsePetition[0]?.finalResponse?.date,
              "YYYY-MM-DD"
            ).format("DD-MM-YYYY")
          : "-"
        : "",
    },

    {
      name: "status",
      value: finalResponsePetition
        ? finalResponsePetition[0]?.finalResponse?.status
          ? finalResponsePetition[0]?.finalResponse?.status
          : "-"
        : "",
    },
  ];

  return (
    <Grid
      ref={printRef}
      container
      style={{
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* petition */}

      <Grid
        container
        style={{
          width: "90%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "5px",
          padding: "10px",
          border: "1px solid #000000",
          margin: "20px 0px",
        }}
      >
        <Grid
          style={{
            height: "50px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h3"
            color="initial"
            style={{
              // fontSize: "12px",
              // fontWeight: "600",
              color: "primary.main",
              paddingBottom: "5px",
              borderBottom: "1px solid grey",
            }}
          >
            Petition Information
          </Typography>
        </Grid>
        <Grid
          item
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid
            item
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "15px 0px 10px 0px",
            }}
          >
            {petitionInformation.map((row: any, index: any) => {
              return (
                <Grid
                  key={index}
                  style={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    maxHeight: "35px",
                    marginBottom: "10px",
                    color: "textPrimary.main",
                  }}
                  className="row"
                >
                  <Grid
                    style={{
                      width: "40%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography style={{ fontSize: "13px", fontWeight: "400" }}>
                      {row.name}
                    </Typography>
                    <Typography style={{ fontSize: "13px", fontWeight: "400" }}>
                      :
                    </Typography>
                  </Grid>
                  <Grid
                    style={{
                      width: "60%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      paddingLeft: 3,
                    }}
                  >
                    <Typography
                      style={{
                        color: "greyScale.main",
                        marginLeft: "10px",
                        fontSize: "13px",
                        fontWeight: "400",
                      }}
                    >
                      {row.value}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>

      {/* field visit */}

      <Grid
        container
        style={{
          width: "90%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "5px",
          padding: "10px",
          border: "1px solid #000000",
          margin: "20px 0px",
        }}
      >
        <Grid
          style={{
            height: "50px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h3"
            color="initial"
            style={{
              // fontSize: "12px",
              // fontWeight: "600",
              color: "primary.main",
              paddingBottom: "5px",
              borderBottom: "1px solid grey",
            }}
          >
            FieldVisit Information
          </Typography>
        </Grid>
        <Grid
          item
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid
            item
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "15px 0px 10px 0px",
            }}
          >
            {fieldVisitInformation.map((row: any, index: any) => {
              return (
                <Grid
                  key={index}
                  style={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    maxHeight: "35px",
                    marginBottom: "10px",
                    color: "textPrimary.main",
                  }}
                  className="row"
                >
                  <Grid
                    style={{
                      width: "40%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography style={{ fontSize: "13px", fontWeight: "400" }}>
                      {row.name}
                    </Typography>
                    <Typography style={{ fontSize: "13px", fontWeight: "400" }}>
                      :
                    </Typography>
                  </Grid>
                  <Grid
                    style={{
                      width: "60%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      paddingLeft: 3,
                    }}
                  >
                    <Typography
                      style={{
                        color: "greyScale.main",
                        marginLeft: "10px",
                        fontSize: "13px",
                        fontWeight: "400",
                      }}
                    >
                      {row.value}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>

      {/* letter */}

      <Grid
        container
        style={{
          width: "90%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "5px",
          padding: "10px",
          border: "1px solid #000000",
          margin: "20px 0px",
        }}
      >
        <Grid
          style={{
            height: "50px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h3"
            color="initial"
            style={{
              // fontSize: "12px",
              // fontWeight: "600",
              color: "primary.main",
              paddingBottom: "5px",
              borderBottom: "1px solid grey",
            }}
          >
            Letter Information
          </Typography>
        </Grid>
        <Grid
          item
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid
            item
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "15px 0px 10px 0px",
            }}
          >
            {letterInformation.map((row: any, index: any) => {
              return (
                <Grid
                  key={index}
                  style={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    maxHeight: "35px",
                    marginBottom: "10px",
                    color: "textPrimary.main",
                  }}
                  className="row"
                >
                  <Grid
                    style={{
                      width: "40%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography style={{ fontSize: "13px", fontWeight: "400" }}>
                      {row.name}
                    </Typography>
                    <Typography style={{ fontSize: "13px", fontWeight: "400" }}>
                      :
                    </Typography>
                  </Grid>
                  <Grid
                    style={{
                      width: "60%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      paddingLeft: 3,
                    }}
                  >
                    <Typography
                      style={{
                        color: "greyScale.main",
                        marginLeft: "10px",
                        fontSize: "13px",
                        fontWeight: "400",
                      }}
                    >
                      {row.value}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>

      {/* final response */}

      <Grid
        container
        style={{
          width: "90%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "5px",
          padding: "10px",
          border: "1px solid #000000",
          margin: "20px 0px",
        }}
      >
        <Grid
          style={{
            height: "50px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h3"
            color="initial"
            style={{
              // fontSize: "12px",
              // fontWeight: "600",
              color: "primary.main",
              paddingBottom: "5px",
              borderBottom: "1px solid grey",
            }}
          >
            Final Response Information
          </Typography>
        </Grid>
        <Grid
          item
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid
            item
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "15px 0px 10px 0px",
            }}
          >
            {finalResponseInformation.map((row: any, index: any) => {
              return (
                <Grid
                  key={index}
                  style={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    maxHeight: "35px",
                    marginBottom: "10px",
                    color: "textPrimary.main",
                  }}
                  className="row"
                >
                  <Grid
                    style={{
                      width: "40%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography style={{ fontSize: "13px", fontWeight: "400" }}>
                      {row.name}
                    </Typography>
                    <Typography style={{ fontSize: "13px", fontWeight: "400" }}>
                      :
                    </Typography>
                  </Grid>
                  <Grid
                    style={{
                      width: "60%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      paddingLeft: 3,
                    }}
                  >
                    <Typography
                      style={{
                        color: "greyScale.main",
                        marginLeft: "10px",
                        fontSize: "13px",
                        fontWeight: "400",
                      }}
                    >
                      {row.value}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        {finalResponsePetition ? (
          <Grid>
            {finalResponsePetition[0]?.finalResponse?.finalDepartmentResponse?.map(
              (data: any, index: any) => {
                return (
                  <>
                    {index === 0 && (
                      <Grid
                        key={index}
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: "20px",
                          borderBottom: 1,
                          borderTop: 1,
                          borderColor: "var(--table-border)",
                          padding: "10px 0",
                        }}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            width: { xs: "25%", md: "25%" },
                            textAlign: "left",
                            // fontSize: "12px",
                            // fontWeight: "600",
                          }}
                        >
                          Department
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{
                            width: { xs: "25%", md: "25%" },
                            textAlign: "left",
                            borderColor: "var(--table-border)",
                            // fontSize: "12px",
                            // fontWeight: "600",
                          }}
                        >
                          Date
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{
                            width: { xs: "25%", md: "25%" },
                            textAlign: "left",
                            borderColor: "var(--table-border)",
                            // fontSize: "12px",
                            // fontWeight: "600",
                          }}
                        >
                          Reply Received
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{
                            width: { xs: "25%", md: "25%" },
                            textAlign: "left",
                            pl: "30px",
                            // fontSize: "12px",
                            // fontWeight: "600",
                          }}
                        >
                          Remarks
                        </Typography>
                      </Grid>
                    )}
                    <Grid
                      key={index}
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: { xs: "row" },
                        alignItems: { xs: "flex-start" },
                        justifyContent: "space-between",
                        mb: "10px",
                        pb: "10px",
                        borderBottom: 1,
                        borderColor: "var(--table-border)",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          width: { xs: "25%", md: "25%" },
                          textAlign: "left",
                          fontSize: "13px",
                          fontWeight: "400",
                        }}
                      >
                        {data?.dep}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          width: { xs: "25%", md: "25%" },
                          textAlign: "left",
                          fontSize: "13px",
                          fontWeight: "400",
                        }}
                      >
                        {data?.dat ? data?.dat : "-"}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          width: { xs: "25%", md: "25%" },
                          textAlign: "left",
                          fontSize: "13px",
                          fontWeight: "400",
                        }}
                      >
                        {data?.rep ? data?.rep : "-"}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          width: { xs: "25%", md: "25%" },
                          textAlign: "left",
                          pl: "30px",
                          fontSize: "13px",
                          fontWeight: "400",
                        }}
                      >
                        {data?.rem ? data?.rem : "-"}
                      </Typography>
                    </Grid>
                  </>
                );
              }
            )}
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default PetitionPrint;
