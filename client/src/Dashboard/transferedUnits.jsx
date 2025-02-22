import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTable, useSortBy } from "react-table";
import {
  faArrowDown,
  faArrowUp,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  AppBar,
  Breadcrumbs,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MultipleStopIcon from "@mui/icons-material/MultipleStop";
import { format } from "date-fns";
import HomeIcon from "@mui/icons-material/Home";
import DevicesIcon from "@mui/icons-material/Devices";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TransferedUnits() {
  const [open, setOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUnits, setFilteredUnits] = useState([]);

  useEffect(() => {
    setFilteredUnits(units);
  }, [units]);

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filteredData = units.filter(
      (unit) =>
        unit.unit_code.toLowerCase().includes(searchValue) ||
        unit.serial_number.toLowerCase().includes(searchValue) ||
        unit.category.category_name.toLowerCase().includes(searchValue) ||
        unit.status.toLowerCase().includes(searchValue)
    );

    setFilteredUnits(filteredData);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await api.get("/units");
        const unit = response.data.data.filter(
          (unit) => unit.transfer_units.length > 0
        );
        setUnits(unit);
      } catch (error) {
        console.error("Error user unit transfered:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  const handleClickOpen = (unit) => {
    setSelectedUnit(unit);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUnit(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: "UNIT CODE",
        accessor: "unit_code",
      },
      {
        Header: "CATEGORY",
        accessor: "category.category_name",
      },
      {
        Header: "SERIAL NUMBER",
        accessor: "serial_number",
      },
      {
        Header: "STATUS",
        accessor: "status",
      },
      {
        Header: "ACTION",
        Cell: ({ row }) => (
          <Tooltip placement="top" title="View Transfered Details" arrow>
            <Button
              className="hover:scale-125"
              onClick={() => handleClickOpen(row.original)}
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Button>
          </Tooltip>
        ),
      },
    ],
    []
  );

  const dialogColumns = useMemo(
    () => [
      {
        Header: "STATUS",
        Cell: ({ row }) =>
          row.index === 0 ? "First User" : row.original.status,
      },
      {
        Header: "RECENT USER",
        accessor: "computer_user.name",
      },
      {
        Header: "DATE OF TRANSFER",
        accessor: (row) => format(new Date(row.date), "MMMM dd, yyyy"),
      },
    ],
    []
  );
  const data = useMemo(() => filteredUnits, [filteredUnits]);
  const dialogData = useMemo(
    () => (selectedUnit ? selectedUnit.transfer_units : []),
    [selectedUnit]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  const {
    getTableProps: getDialogTableProps,
    getTableBodyProps: getDialogTableBodyProps,
    headerGroups: dialogHeaderGroups,
    rows: dialogRows,
    prepareRow: prepareDialogRow,
  } = useTable({ columns: dialogColumns, data: dialogData }, useSortBy);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <>
      <p className="pt-10 ml-10 text-2xl font-normal">User Unit Transfered</p>
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
            <MultipleStopIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Transfered Units
          </Typography>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="text.primary"
          >
            <DevicesIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            User Unit Transfered
          </Typography>
        </Breadcrumbs>
      </div>
      <br /> <br />
      <div className="h-full ml-10 mr-10">
        {/* Search bar */}
        <TextField
          label="Search..."
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
        <TableContainer className="mt-1 bg-white rounded-lg shadow-md">
          <Table {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow
                  {...headerGroup.getHeaderGroupProps()}
                  className="bg-blue-400"
                >
                  {headerGroup.headers.map((column) => (
                    <TableCell
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      align="center"
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color="white"
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
                  <TableCell colSpan={5}>
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
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    prepareRow(row);
                    return (
                      <TableRow {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <TableCell {...cell.getCellProps()} align="center">
                            {cell.render("Cell")}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
              )}
              {loading
                ? ""
                : emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={5}>
                        {filteredUnits.length === 0 ? (
                          !searchTerm ? (
                            <p className="text-xl text-center">
                              No units to found.
                            </p>
                          ) : (
                            <p className="text-xl text-center">
                              No "{searchTerm}" result found.
                            </p>
                          )
                        ) : (
                          ""
                        )}{" "}
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 15, 20]}
            component="div"
            count={filteredUnits.length}
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
      {selectedUnit && (
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <Typography
                sx={{ ml: 2, flex: 1, textAlign: "center" }}
                variant="h6"
                component="div"
              >
                {selectedUnit.serial_number} -{" "}
                {selectedUnit.category.category_name}
              </Typography>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <DialogContent dividers>
            <div style={{ overflowY: "auto" }}>
              <TableContainer
                className="w-full bg-white rounded-lg shadow-md"
                style={{
                  maxWidth: "1000px",
                  margin: "0 auto",
                  textAlign: "center",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              >
                <Table {...getDialogTableProps()}>
                  <TableHead>
                    {dialogHeaderGroups.map((headerGroup) => (
                      <TableRow
                        {...headerGroup.getHeaderGroupProps()}
                        className="bg-[#FF6600]"
                      >
                        {headerGroup.headers.map((column) => (
                          <TableCell
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                            align="center"
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              color="white"
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
                  <TableBody {...getDialogTableBodyProps()}>
                    {dialogRows.map((row) => {
                      prepareDialogRow(row);
                      return (
                        <TableRow {...row.getRowProps()}>
                          {row.cells.map((cell) => (
                            <TableCell {...cell.getCellProps()} align="center">
                              {cell.render("Cell")}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                    {dialogRows.length === 0 && (
                      <TableRow>
                        <TableCell align="center" colSpan={3}>
                          No data found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default TransferedUnits;
