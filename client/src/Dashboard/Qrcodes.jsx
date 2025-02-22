import { Link } from "react-router-dom";
import Codes from "./Codes";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Breadcrumbs, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

function QrC() {
  return (
    <>
      <p className="pt-10 ml-10 text-2xl font-normal">Scan QR Codes</p>
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
            color="text.primary"
          >
            <QrCodeScannerIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Scan QR
          </Typography>
        </Breadcrumbs>
      </div>
      <br /> <br />
      <div className="flex items-center justify-center text-center">
        <Codes />
      </div>
    </>
  );
}

export default QrC;
