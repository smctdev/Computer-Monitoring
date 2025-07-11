import { useState, useRef } from "react";
import { Container, Card, CardContent, Grid, Button } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import QrReader from "react-qr-reader";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Codes() {
  const [scanResultFile, setScanResultFile] = useState("");
  const [scanResultWebCam, setScanResultWebCam] = useState("");
  const classes = useStyles();
  const qrRef = useRef(null);
  const linkRef = useRef(null);

  const handleErrorFile = (error) => {
    console.error(error);
  };

  const handleScanFile = (result) => {
    if (!result) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Invalid QR code or no such QR code found in the image",
      });
      return;
    }

    const parsedResult = JSON.parse(result);

    if (parsedResult?.name || parsedResult?.id) {
      setScanResultFile(parsedResult);
      Swal.fire({
        title: "Success",
        icon: "success",
        text: `${parsedResult.name} QR code scanned successfully`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Open",
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed) {
          linkRef.current.click();
        }
      });
    } else {
      setScanResultFile({
        id: `${window.location.origin}/computers/${result}`,
        name: result,
      });
      Swal.fire({
        title: "Success",
        icon: "success",
        text: `${result} QR code scanned successfully`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Open",
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed) {
          linkRef.current.click();
        }
      });
    }
  };

  const handleErrorWebCam = (error) => {
    console.error(error);
  };

  const handleScanWebCam = (result) => {
    const parsedResult = JSON.parse(result);

    if (parsedResult?.name || parsedResult?.id) {
      setScanResultWebCam(parsedResult);
      Swal.fire({
        title: "Success",
        icon: "success",
        text: `${parsedResult.name} QR code scanned successfully`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Open",
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed) {
          linkRef.current.click();
        }
      });
    } else {
      setScanResultWebCam({
        id: `${window.location.origin}/computers/${result}`,
        name: result,
      });
      Swal.fire({
        title: "Success",
        icon: "success",
        text: `${result} QR code scanned successfully`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Open",
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed) {
          linkRef.current.click();
        }
      });
    }
  };

  const onScanFile = () => {
    qrRef?.current?.openImageDialog();
  };

  return (
    <Container className={classes.container}>
      <Card>
        <h2 className={classes.title}>SCAN QR CODE</h2>
        <CardContent>
          <Grid container spacing={10} justifyContent="center">
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                Qr Code Scan by Camera
              </h3>
              <QrReader
                delay={300}
                style={{ width: "100%" }}
                onError={handleErrorWebCam}
                onScan={handleScanWebCam}
              />

              <h3 className="mt-3">
                Computer Link:
                <br />
              </h3>
              {scanResultWebCam && (
                <Link to={scanResultWebCam?.id} ref={linkRef}>
                  <Button>
                    <b>{scanResultWebCam?.name}</b>
                  </Button>
                </Link>
              )}
            </Grid>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <Button
                className={classes.btn}
                variant="contained"
                color="secondary"
                onClick={onScanFile}
                style={{ marginBottom: "5px", marginTop: "-4px" }}
              >
                Upload QR Code to Scan
              </Button>
              <QrReader
                ref={qrRef}
                delay={300}
                style={{ width: "100%" }}
                onError={handleErrorFile}
                onScan={handleScanFile}
                legacyMode
              />
              <h3 className="mt-3">
                Computer Link:
                <br />
              </h3>
              {scanResultFile !== "[]"
                ? scanResultFile && (
                    <Link to={scanResultFile?.id} ref={linkRef}>
                      <Button>
                        <b>{scanResultFile?.name}</b>
                      </Button>
                    </Link>
                  )
                : scanResultFile && (
                    <Button>
                      <b>No computer link found.</b>
                    </Button>
                  )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

const useStyles = makeStyles({
  container: {
    marginTop: 10,
  },
  title: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0033A0",
    color: "#fff",
    padding: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
  btn: {
    marginTop: 10,
    marginBottom: 20,
  },
});

export default Codes;
