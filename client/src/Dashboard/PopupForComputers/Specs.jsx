import { useState, useEffect, useMemo } from "react";
import smct from "./../../img/smct.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import CloseIcon from "@mui/icons-material/Close";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useTable, useSortBy } from "react-table";
import api from "../../api/axios";

function Specs({ isOpen, onClose, specsId }) {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [computerUser, setComputerUser] = useState("");

  useEffect(() => {
    if (!isOpen || !specsId) {
      return;
    }
    const fetchSpecsData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`computer-user-specs/${specsId}`);
        if (response.status === 200) {
          const specs = response.data.computer_user_specs;
          const computers = specs.computers;
          const units = computers[0].units;
          setComputerUser(specs.name);
          setUnits(units);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecsData();
  }, [isOpen, specsId]);

  const columns = useMemo(
    () => [
      { Header: "UNIT CODE", accessor: "unit_code" },
      { Header: "CATEGORY", accessor: "category.category_name" },
      { Header: "DESCRIPTION", accessor: "description" },
      { Header: "SUPPLIER", accessor: "supplier.supplier_name" },
      {
        Header: "DATE OF PURCHASE",
        accessor: (row) =>
          format(new Date(row.date_of_purchase), "MMMM dd, yyyy"),
      },
      { Header: "SERIAL NUMBER", accessor: "serial_number" },
    ],
    []
  );

  const data = useMemo(() => units, [units]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  const handleClose = () => {
    onClose();
    setUnits([]);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-40">
      <div
        className="bg-white shadow-md rounded-2xl"
        style={{ maxWidth: "100vh", maxHeight: "85vh" }}
      >
        <div className="relative flex p-5 bg-blue-500 rounded-tr-2xl rounded-tl-2xl">
          <div className="flex-none">
            <img
              src={smct}
              alt="SMCT Logo"
              className="block h-24 m-0 w-60"
            ></img>
          </div>
          <div className="text-3xl font-medium text-white flex-2 ml-28 mt-7">
            Computer User: {loading ? "Loading..." : computerUser}
          </div>
          <CloseIcon
            onClick={handleClose}
            className="absolute text-white cursor-pointer right-5 top-5"
          />
        </div>
        <div className="max-h-[calc(85vh-130px)] mt-6 mb-4 ml-6 mr-6 overflow-y-scroll text-justify">
          <h2 className="mb-4 text-xl font-semibold">Specifications:</h2>
          <TableContainer component={Paper}>
            <Table {...getTableProps()}>
              <TableHead>
                {headerGroups.map((headerGroup) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <TableCell
                        align="center"
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        <Typography
                          variant="subtitle1"
                          className="flex"
                          fontWeight="bold"
                        >
                          {column.render("Header")}
                          <span className="ml-2">
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <FontAwesomeIcon icon={faArrowDown} />
                              ) : (
                                <FontAwesomeIcon icon={faArrowUp} />
                              )
                            ) : (
                              ""
                            )}
                          </span>
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody {...getTableBodyProps()}>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-full p-4 rounded">
                          <div className="flex space-x-4 animate-pulse">
                            <div className="flex-1 py-1 space-y-6">
                              <div className="h-10 bg-gray-200 rounded shadow"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => {
                    prepareRow(row);
                    return (
                      <TableRow key={row.index} {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <TableCell align="center" {...cell.getCellProps()}>
                            {cell.column.id === "description"
                              ? cell.value
                                  .split("\n")
                                  .map((line, index) => (
                                    <div key={index}>{line}</div>
                                  ))
                              : cell.render("Cell")}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                )}
                {!loading && units.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <p className="py-5 text-lg">No records found.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default Specs;
