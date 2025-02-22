import Dashboard from "./Db2";
import { Breadcrumbs, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useAuth } from "../context/AuthContext";

function DashBoard() {
  const { user } = useAuth();

  return (
    <>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 row-span-1">
          <p className="pt-10 ml-10 text-2xl font-normal">Dashboard</p>
          <div className="mt-2 ml-10">
            <Breadcrumbs aria-label="breadcrumb">
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="text.primary"
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Home
              </Typography>
            </Breadcrumbs>
          </div>
        </div>
        <div className="justify-end col-span-1 row-span-1 text-end">
          {user && (
            <p className="pt-10 text-lg font-normal mr-14">
              Welcome,{" "}
              <b>
                {user.firstName} {user.lastName}
              </b>
            </p>
          )}
        </div>
      </div>
      <br /> <br />
      <div className="ml-10 mr-10">
        <Dashboard />
      </div>
    </>
  );
}

export default DashBoard;
