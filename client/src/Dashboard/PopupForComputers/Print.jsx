import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../styles/Printing.css";
import header from "../../img/headerForPrinting.png";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import api from "../../api/axios";
import { format } from "date-fns";

const PrintInformation = () => {
  const { id } = useParams();
  const [computer, setComputer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchComputerData = async () => {
      try {
        const response = await api.get(`computers/${id}`);
        console.log(response);
        if (response.status === 200) {
          setComputer(response.data.computer);

          window.print();
          window.onafterprint = handleAfterPrint;
        } else {
          console.error("Fetch error:", response.data.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComputerData();
  }, [id]);

  const handleAfterPrint = () => {
    window.location.href = "/computers";
  };

  useEffect(() => {
    document.title = loading
      ? "Computer Monitoring - Loading..."
      : computer
      ? `Computer Monitoring - ${computer.computer_user.name} Computer Detaills to Print`
      : "Computer Monitoring - Not Found";
  });

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="w-16 h-16 border-8 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
          <p className="absolute mt-24 text-xl text-center">
            <strong>Loading...</strong>
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 w-full h-full bg-white z-[100] ">
      <img src={header} alt="Header" />
      <p className="text-xl">
        User ID: <b>{computer?.computer_user_id}</b>
      </p>
      <p className="text-xl">
        Branch Code: <b>{computer?.computer_user.branch_code.branch_name}</b>
      </p>
      <p className="text-xl">
        Name of User: <b>{computer?.computer_user.name}</b>
      </p>
      <p className="text-xl">
        Position: <b>{computer?.computer_user.position.position_name}</b>
      </p>
      <p className="text-xl">
        Computer ID: <b>{computer?.id}</b>
      </p>
      <p className="text-xl">
        Total Format:{" "}
        <b>
          {computer?.formatted_status === 0 ? (
            "No formatting has been applied yet."
          ) : (
            <span
              className={
                computer?.formatted_status >= 10
                  ? "bg-red-500 text-white text-sm font-semibold px-4 py-1 rounded-full"
                  : "bg-yellow-500 text-white text-sm font-semibold px-4 py-1 rounded-full"
              }
            >
              {computer?.formatted_status}
            </span>
          )}
        </b>
      </p>
      <br />
      <p className="text-xl font-semibold">SPECIFICATIONS</p> <br />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                UNIT CODE
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                CATEGORY
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                DESCRIPTION
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                SUPPLIER
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                DATE OF PURCHASE
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                SERIAL NUMBER
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                STATUS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {computer?.units.map((unit, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: "10px" }} align="center">
                  {unit.unit_code}
                </TableCell>
                <TableCell sx={{ fontSize: "10px" }} align="center">
                  {unit.category.category_name}
                </TableCell>
                <TableCell sx={{ fontSize: "10px" }} align="center">
                  {unit.description.split("\n").map((line, lineIndex) => (
                    <div key={lineIndex}>{line}</div>
                  ))}
                </TableCell>
                <TableCell sx={{ fontSize: "10px" }} align="center">
                  {unit.supplier.supplier_name}
                </TableCell>
                <TableCell sx={{ fontSize: "10px" }} align="center">
                  {format(new Date(unit.date_of_purchase), "MMMM dd, yyyy")}
                </TableCell>
                <TableCell sx={{ fontSize: "10px" }} align="center">
                  {unit.serial_number}
                </TableCell>
                <TableCell sx={{ fontSize: "10px" }} align="center">
                  {unit.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <p className="py-10 text-xl font-semibol">INSTALLED APPLICATIONS</p>
      {Array.isArray(computer?.installed_applications) ? (
        <div className="flex flex-wrap gap-2">
          {computer?.installed_applications.length === 0
            ? "No records yet."
            : computer?.installed_applications.map((item, idx) => (
                <span
                  className="px-5 py-2 border rounded-full bg-slate-100 hover:bg-slate-200"
                  key={idx}
                >
                  {item.application_content}
                </span>
              ))}
        </div>
      ) : (
        <span>{computer?.installed_applications}</span>
      )}
      <br />
      <p className="text-xl font-semibold">REMARKS</p> <br />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                DATE
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                TASK PERFORMED
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "10px" }}>
                PERFORMED BY
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {computer?.remarks.map((remark, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: "10px" }} align="center">
                  {format(new Date(remark.date), "MMMM dd, yyyy")}
                </TableCell>
                <TableCell sx={{ fontSize: "10px" }} align="center">
                  {remark.remark_content.split("\n").map((line, lineIndex) => (
                    <div key={lineIndex}>{line}</div>
                  ))}
                </TableCell>
                <TableCell sx={{ fontSize: "10px" }} align="center">
                  {remark.user?.firstName} {remark.computer_user?.lastName}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PrintInformation;
