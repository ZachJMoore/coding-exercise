import * as React from "react";
import Head from "next/head";
import constants from "../constants";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import styled from "@emotion/styled";

const InfoItem = styled(Box)`
  background-color: ${grey[100]};
  padding: 12px;
  border-radius: 8px;
`;

export default function Home() {
  // Data
  const [searchResults, setSearchData] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [isFetching, setIsFetching] = React.useState(true);

  // Selections
  const [selectedTypeIndex, setSelectedTypeIndex] = React.useState(0);
  const [selectedStateIndex, setSelectedStateIndex] = React.useState(51);

  const [selectedRowIndex, setSelectedRowIndex] = React.useState(null);

  const type = React.useMemo(
    () => constants.searchTypes[selectedTypeIndex],
    [selectedTypeIndex]
  );
  const state = React.useMemo(
    () => constants.stateList[selectedStateIndex],
    [selectedStateIndex]
  );
  const row = React.useMemo(
    () => searchResults[selectedRowIndex],
    [selectedRowIndex, searchResults]
  );

  // Fetching
  const handleSearch = React.useCallback(
    async (e) => {
      if (e) {
        e.preventDefault();
      }

      if (!type || !state) {
        return;
      }

      setErrorMessage(null);
      setSelectedRowIndex(null);
      setIsFetching(true);

      try {
        const url = `${type.url}/${state.abbreviation}`;

        const res = await fetch(url);
        const data = await res.json();
        setSearchData(data.results);
      } catch (err) {
        let errorMessage = "Something went wrong. Please try again.";
        if (typeof err === "string") {
          errorMessage = err;
        } else if (err?.message) {
          errorMessage = err.message;
        }

        setErrorMessage(errorMessage);
      }

      setIsFetching(false);
    },
    [type, state]
  );

  // Load data on first load
  React.useEffect(() => {
    handleSearch();
  }, []);

  return (
    <Grid
      container
      sx={{
        padding: 2,
      }}
      spacing={2}
    >
      <Head>
        <title>{"Who's' My Representative?"}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid item xs={12}>
        <Typography
          variant="h4"
          component="h1"
          mt={4}
          mb={8}
          sx={{
            color: "#49A8ED",
          }}
        >
          {"Who's My Representative?"}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      {errorMessage && (
        <Grid item xs={12}>
          <Alert severity="error">{errorMessage}</Alert>
        </Grid>
      )}

      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ padding: 2 }}>
          <form onSubmit={handleSearch}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Search Type</InputLabel>
                  <Select
                    value={selectedTypeIndex}
                    label="Search Type"
                    onChange={(e) => setSelectedTypeIndex(e.target.value)}
                    disabled={isFetching}
                  >
                    {constants.searchTypes.map((type, index) => (
                      <MenuItem key={index} value={index}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    value={selectedStateIndex}
                    label="State"
                    onChange={(e) => setSelectedStateIndex(e.target.value)}
                    disabled={isFetching}
                  >
                    {constants.stateList.map((state, index) => (
                      <MenuItem key={index} value={index}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isFetching}
                  size="large"
                  sx={{
                    height: "100%",
                    minWidth: 104,
                  }}
                  disableElevation
                >
                  {isFetching ? <CircularProgress size={24} /> : "Search"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>

      <Grid item xs={12} mt={2}>
        <Grid container spacing={6}>
          <Grid item xs={12} lg={6}>
            <Typography variant="h4" component="h2">
              List /{" "}
              <span
                style={{
                  color: "#49A8ED",
                }}
              >
                {type?.name}
              </span>
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Party</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchResults.map((row, index) => (
                    <TableRow
                      key={index}
                      onClick={() => setSelectedRowIndex(index)}
                      selected={selectedRowIndex === index}
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.party}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Typography variant="h4" component="h2">
              Info
            </Typography>

            <InfoItem mb={2}>
              <Typography variant="body1" color={!row?.name && "textSecondary"}>
                {row?.name?.split(" ")[0] || "First Name"}
              </Typography>
            </InfoItem>

            <InfoItem mb={2}>
              <Typography variant="body1" color={!row?.name && "textSecondary"}>
                {row?.name?.split(" ")[1] || "Last Name"}
              </Typography>
            </InfoItem>

            <InfoItem mb={2}>
              <Typography
                variant="body1"
                color={!row?.district && "textSecondary"}
              >
                {row?.district || "District"}
              </Typography>
            </InfoItem>

            <InfoItem mb={2}>
              <Typography
                variant="body1"
                color={!row?.phone && "textSecondary"}
              >
                {row?.phone || "Phone"}
              </Typography>
            </InfoItem>

            <InfoItem mb={2}>
              <Typography
                variant="body1"
                color={!row?.office && "textSecondary"}
              >
                {row?.office || "Office"}
              </Typography>
            </InfoItem>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}