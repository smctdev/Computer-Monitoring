import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faArrowUp,
  faArrowDown,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Typography,
  TablePagination,
  TextField,
  Breadcrumbs,
  Tooltip,
} from "@mui/material";
import Add from "./Add";
import EditSet from "./Editset";
import api from "../../api/axios";
import { format } from "date-fns";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import MouseIcon from "@mui/icons-material/Mouse";
import { DateTime } from "luxon";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function Set() {
  const [isAddPopupOpen, setAddPopupOpen] = useState(false);
  const classes = useStyles();
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [computerUser, setComputerUser] = useState([]);
  const [computerSetRefresh, setComputerSetRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAllRows, setShowAllRows] = useState([]);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editId, setEditId] = useState(0);

  const toggleShowAllRows = (rowId) => {
    if (showAllRows.includes(rowId)) {
      setShowAllRows(showAllRows.filter((id) => id !== rowId));
    } else {
      setShowAllRows([...showAllRows, rowId]);
    }
  };

  useEffect(() => {
    const fetchComputerUser = async () => {
      try {
        const response = await api.get("/computer-users");
        setComputerUser(response.data.hasComputerSet);
        setFilteredData(response.data.hasComputerSet);
      } catch (error) {
        console.error("Error fetching computer users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComputerUser();
  }, [computerSetRefresh]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const filtered = computerUser.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const openAddPopup = () => {
    setAddPopupOpen(true);
  };

  const closeAddPopup = () => {
    setAddPopupOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openEditPopup = (id) => () => {
    setEditId(id);
    setIsEditPopupOpen(!isEditPopupOpen);
  };

  const rows = filteredData;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const sortRows = (rows) => {
    return rows.sort((a, b) => {
      let valueA, valueB;

      if (sortColumn === "id") {
        valueA = a.id;
        valueB = b.id;
      } else if (sortColumn === "name") {
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
      }

      if (sortOrder === "asc") {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  };

  const handleSort = (column) => {
    const isAscending = sortColumn === column && sortOrder === "asc";
    setSortColumn(column);
    setSortOrder(isAscending ? "desc" : "asc");
  };

  const now = DateTime.now().setZone("Asia/Manila").toJSDate();

  return (
    <>
      <p className="pt-10 ml-10 text-2xl font-normal">Assign Computer Set</p>
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
            <MouseIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Assign Computer Set
          </Typography>
        </Breadcrumbs>
      </div>
      <br /> <br />
      <div className="flex items-center justify-center mr-10">
        <div className="flex justify-end flex-grow">
          <div className="z-0 mr-5">
            <TextField
              label="Search User"
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              fullWidth
              sx={{ width: 300 }}
              size="small"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className="mt-3.5">
            <button
              onClick={openAddPopup}
              className="pt-2 pb-2 pl-4 pr-4 text-base font-semibold text-white bg-[#0033A0] hover:bg-blue-700 border border-transparent rounded-full"
            >
              Assign Computer Set to User
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mt-5 ml-10 mr-10">
        <div className="z-0 w-full max-h-max rounded-xl">
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow className="bg-blue-400">
                  <TableCell align="center" onClick={() => handleSort("id")}>
                    <p className="font-semibold text-white">
                      ID{" "}
                      {sortColumn === "id" &&
                        (sortOrder === "asc" ? (
                          <FontAwesomeIcon icon={faArrowDown} />
                        ) : (
                          <FontAwesomeIcon icon={faArrowUp} />
                        ))}
                    </p>
                  </TableCell>
                  <TableCell align="center">
                    <p className="font-semibold text-white">DATE OF PURCHASE</p>
                  </TableCell>
                  <TableCell align="center">
                    <p className="font-semibold text-white">CATEGORY</p>
                  </TableCell>
                  <TableCell align="center">
                    <p className="font-semibold text-white">DESCRIPTION</p>
                  </TableCell>
                  <TableCell align="center">
                    <p className="font-semibold text-white">SUPPLIER</p>
                  </TableCell>
                  <TableCell align="center">
                    <p className="font-semibold text-white">SERIAL NO.</p>
                  </TableCell>
                  <TableCell align="center">
                    <p className="font-semibold text-white">STATUS</p>
                  </TableCell>
                  <TableCell align="center" onClick={() => handleSort("name")}>
                    <p className="font-semibold text-white">
                      ASSIGNED TO
                      {sortColumn === "name" &&
                        (sortOrder === "asc" ? (
                          <FontAwesomeIcon icon={faArrowDown} />
                        ) : (
                          <FontAwesomeIcon icon={faArrowUp} />
                        ))}
                    </p>
                  </TableCell>
                  <TableCell align="center">
                    <p className="font-semibold text-white">ACTION</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9}>
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
                  sortRows(rows)
                    .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                    .map((row, rowIndex) => (
                      <React.Fragment key={`${row.id}-${rowIndex}`}>
                        <TableRow
                          className={
                            row.computers
                              .map((comp) =>
                                format(
                                  new Date(comp.date_cleaning),
                                  "yyyy-MM-dd"
                                )
                              )
                              .join(", ") <= format(new Date(now), "yyyy-MM-dd")
                              ? "bg-red-200 animate-pulse relative"
                              : "relative"
                          }
                        >
                          <TableCell
                            align="center"
                            style={{ borderBottom: "none" }}
                          >
                            {row.id}

                            {row.computers
                              .map((comp) =>
                                format(
                                  new Date(comp.date_cleaning),
                                  "yyyy-MM-dd"
                                )
                              )
                              .join(", ") <=
                              format(new Date(now), "yyyy-MM-dd") && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "55%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  fontWeight: "bold",
                                  color: "red",
                                }}
                              >
                                <p>
                                  <FontAwesomeIcon
                                    style={{ fontSize: "50px" }}
                                    icon={faTriangleExclamation}
                                  />
                                </p>
                                <p
                                  style={{
                                    fontSize: "15px",
                                  }}
                                >
                                  The computer of the user is ready for cleanup
                                  or needs a cleanup to optimize performance.
                                </p>
                              </div>
                            )}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ borderBottom: "none" }}
                          >
                            {row.computers.map((computer) =>
                              computer.units.map((unit, index) => (
                                <React.Fragment key={index}>
                                  <div>
                                    {showAllRows.includes(row.id)
                                      ? format(
                                          new Date(unit.date_of_purchase),
                                          "yyyy-MM-dd"
                                        )
                                      : index < 3
                                      ? format(
                                          new Date(unit.date_of_purchase),
                                          "yyyy-MM-dd"
                                        )
                                      : null}
                                  </div>
                                </React.Fragment>
                              ))
                            )}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ borderBottom: "none" }}
                          >
                            {row.computers.map((computer) =>
                              computer.units.map((unit, index) => (
                                <React.Fragment key={index}>
                                  <div>
                                    {showAllRows.includes(row.id)
                                      ? unit.category.category_name
                                      : index < 3
                                      ? unit.category.category_name
                                      : null}
                                  </div>
                                </React.Fragment>
                              ))
                            )}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ borderBottom: "none" }}
                          >
                            {row.computers.map((computer) =>
                              computer.units.map((unit, index) => (
                                <React.Fragment key={index}>
                                  <div>
                                    {showAllRows.includes(row.id)
                                      ? unit.description
                                          .split("\n")
                                          .map((line, lineIndex) => (
                                            <div key={lineIndex}>{line}</div>
                                          ))
                                      : index < 3
                                      ? unit.description
                                          .split("\n")
                                          .map((line, lineIndex) => (
                                            <div key={lineIndex}>{line}</div>
                                          ))
                                      : null}
                                  </div>
                                </React.Fragment>
                              ))
                            )}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ borderBottom: "none" }}
                          >
                            {row.computers.map((computer) =>
                              computer.units.map((unit, index) => (
                                <React.Fragment key={index}>
                                  <div>
                                    {showAllRows.includes(row.id)
                                      ? unit.supplier.supplier_name
                                      : index < 3
                                      ? unit.supplier.supplier_name
                                      : null}
                                  </div>
                                </React.Fragment>
                              ))
                            )}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ borderBottom: "none" }}
                          >
                            {row.computers.map((computer) =>
                              computer.units.map((unit, index) => (
                                <React.Fragment key={index}>
                                  <div>
                                    {showAllRows.includes(row.id)
                                      ? unit.serial_number
                                      : index < 3
                                      ? unit.serial_number
                                      : null}
                                  </div>
                                </React.Fragment>
                              ))
                            )}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ borderBottom: "none" }}
                          >
                            {row.computers.map((computer) =>
                              computer.units.map((unit, index) => (
                                <React.Fragment key={index}>
                                  <div>
                                    {showAllRows.includes(row.id)
                                      ? unit.status
                                      : index < 3
                                      ? unit.status
                                      : null}
                                  </div>
                                </React.Fragment>
                              ))
                            )}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ borderBottom: "none" }}
                          >
                            <button onClick={openEditPopup(row.id)}>
                              {row.name}
                            </button>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ borderBottom: "none" }}
                          >
                            <Tooltip
                              placement="top"
                              title="Edit Computer Set"
                              arrow
                            >
                              <button
                                onClick={openEditPopup(row.id)}
                                className="hover:scale-125"
                              >
                                <FontAwesomeIcon
                                  className="text-2xl text-blue-500 hover:text-blue-600"
                                  icon={faUserPen}
                                />
                              </button>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                        {/* Show more / Show less button */}
                        <TableRow
                          className={
                            row.computers
                              .map((comp) =>
                                format(
                                  new Date(comp.date_cleaning),
                                  "yyyy-MM-dd"
                                )
                              )
                              .join(", ") <= format(new Date(now), "yyyy-MM-dd")
                              ? "bg-red-200 animate-pulse"
                              : ""
                          }
                        >
                          <TableCell colSpan={9} align="center">
                            <button
                              onClick={() => toggleShowAllRows(row.id)}
                              style={{ color: "cornflowerblue" }}
                            >
                              {showAllRows.includes(row.id)
                                ? "Show less"
                                : "Show more"}
                            </button>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))
                )}
                {loading
                  ? ""
                  : emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={9}>
                          {rows.length === 0 ? (
                            !searchTerm ? (
                              <p className="text-xl text-center">
                                No user has an assigned computer set.
                              </p>
                            ) : (
                              <p className="text-xl text-center">
                                No "{searchTerm}" result found.
                              </p>
                            )
                          ) : (
                            ""
                          )}
                        </TableCell>
                      </TableRow>
                    )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 15, 20, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={
                <Typography variant="subtitle" fontWeight={600}>
                  Entries Per Page:
                </Typography>
              }
            />
          </TableContainer>
        </div>
      </div>
      {isEditPopupOpen && (
        <EditSet
          isOpen={isEditPopupOpen}
          onClose={openEditPopup(editId)}
          onSubmit={setComputerSetRefresh}
          editId={editId}
        />
      )}
      {isAddPopupOpen && (
        <Add
          isOpen={isAddPopupOpen}
          onClose={closeAddPopup}
          onSubmit={setComputerSetRefresh}
          refresh={computerSetRefresh}
        />
      )}
    </>
  );
}

export default Set;
