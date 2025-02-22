import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import {
  Autocomplete,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

function User() {
  const [position, setPosition] = useState({ positions: [] });
  const [branchcode, setBranchcode] = useState({ branches: [] });
  const [uloading, setuLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [user, setUser] = useState({
    name: "",
    email: "",
    position: "",
    branch_code: "",
  });

  useEffect(() => {
    const fetchBrancheCode = async () => {
      try {
        const response = await api.get("/branches");
        setBranchcode(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchBrancheCode();
  }, []);
  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const response = await api.get("/positions");
        setPosition(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchPosition();
  }, []);

  // This is a sample data for Position
  const Position =
    position.positions && position.positions.length > 0
      ? position.positions.map((pos) => ({
          id: pos.id,
          position_name: pos.position_name,
        }))
      : [];

  // This is a sample data for Branchcode
  const Branchcode =
    branchcode.branches && branchcode.branches.length > 0
      ? branchcode.branches.map((branch) => ({
          id: branch.id,
          branch_name: branch.branch_name,
        }))
      : [];

  const handleSubmitUser = async (event) => {
    event.preventDefault();
    setuLoading(true);
    try {
      const response = await api.post("/add-computer-user", {
        name: user.name,
        email: user.email,
        position: user.position,
        branch_code: user.branch_code,
      });
      if (response.data.status === true) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "green",
          customClass: {
            popup: "colored-toast",
          },
          showConfirmButton: false,
          showCloseButton: true,
          timer: 2500,
          timerProgressBar: true,
        });
        (async () => {
          await Toast.fire({
            icon: "success",
            title: response.data.message,
          });
        })();
        setUser({
          name: "",
          email: "",
          position: "",
          branch_code: "",
        });
        setValidationErrors("");
      }
    } catch (error) {
      console.error("Error in adding user:", error);
      if (error.response && error.response.data) {
        console.error("Backend error response:", error.response.data);
        setValidationErrors(error.response.data.errors || {});
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "red",
          customClass: {
            popup: "colored-toast",
          },
          showConfirmButton: false,
          showCloseButton: true,
          timer: 2500,
          timerProgressBar: true,
        });
        (async () => {
          await Toast.fire({
            icon: "error",
            title: error.response.data.message,
          });
        })();
      } else {
        console.error("ERROR!");
      }
    } finally {
      setuLoading(false);
    }
  };

  return (
    <>
      <p className="pt-10 ml-10 text-2xl font-normal">Setup Computer User</p>
      <div className="mt-2 ml-10">
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            path
            to="/dashboard"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
          >
            <SettingsIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Setup
          </Typography>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="text.primary"
          >
            <GroupAddIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Setup Users
          </Typography>
        </Breadcrumbs>
      </div>
      <br /> <br />
      <div className="flex-none mt-10">
        <Container>
          <form onSubmit={handleSubmitUser}>
            <Card>
              <h2 className="flex items-center justify-center p-5 text-2xl font-semibold text-white bg-blue-400">
                SET UP USERS
              </h2>
              <CardContent>
                <Grid container spacing={3} className="p-5">
                  {/* First Row */}
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                      id="name-user"
                      label="Full Name"
                      variant="standard"
                      style={{ width: "100%" }}
                    />
                    <div className="mt-1 text-center text-red-500">
                      {validationErrors.name &&
                        validationErrors.name.map((error, index) => (
                          <div key={index}>{error}</div>
                        ))}
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      id="email-user"
                      label="Email (optional)"
                      variant="standard"
                      style={{ width: "100%" }}
                    />
                    <div className="mt-1 text-center text-red-500">
                      {validationErrors.email &&
                        validationErrors.email.map((error, index) => (
                          <div key={index}>{error}</div>
                        ))}
                    </div>
                  </Grid>

                  {/* Second Row */}
                  <Grid item xs={12} sm={6} md={6}>
                    <Autocomplete
                      freeSolo
                      id="position-user"
                      disableClearable
                      options={Position}
                      readOnly={Position.length === 0}
                      getOptionLabel={(option) => option.position_name || ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            Position.length === 0
                              ? "No position added yet"
                              : "Position"
                          }
                          variant="standard"
                          style={{ width: "100%" }}
                          InputProps={{
                            ...params.InputProps,
                            type: "search",
                          }}
                        />
                      )}
                      value={
                        Position.find(
                          (option) => option.id === user.position
                        ) || {}
                      }
                      onChange={(event, newValue) =>
                        setUser({ ...user, position: newValue.id })
                      }
                    />
                    <div className="mt-1 text-center text-red-500">
                      {validationErrors.position &&
                        validationErrors.position.map((error, index) => (
                          <div key={index}>{error}</div>
                        ))}
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <Autocomplete
                      freeSolo
                      id="branch_code-user"
                      disableClearable
                      readOnly={Branchcode.length === 0}
                      options={Branchcode}
                      getOptionLabel={(option) => option.branch_name || ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            Branchcode.length === 0
                              ? "No branch Code added yet"
                              : "Branch Code"
                          }
                          variant="standard"
                          style={{ width: "100%" }}
                          InputProps={{
                            ...params.InputProps,
                            type: "search",
                          }}
                        />
                      )}
                      value={
                        Branchcode.find(
                          (option) => option.id === user.branch_code
                        ) || {}
                      }
                      onChange={(event, newValue) =>
                        setUser({ ...user, branch_code: newValue.id })
                      }
                    />
                    <div className="mt-1 text-center text-red-500">
                      {validationErrors.branch_code &&
                        validationErrors.branch_code.map((error, index) => (
                          <div key={index}>{error}</div>
                        ))}
                    </div>
                  </Grid>

                  {/* Button Row */}
                  <Grid
                    item
                    xs={12}
                    className="flex items-center justify-center"
                  >
                    <Button
                      type="submit"
                      disabled={uloading}
                      variant="contained"
                      style={{
                        width: "300px",
                        fontWeight: "550",
                        borderRadius: "100px",
                        fontSize: "16px",
                        backgroundColor: "#0033A0",
                        color: "white",
                      }}
                    >
                      {uloading ? "ADDING..." : "ADD"}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Container>
      </div>
    </>
  );
}

export default User;
