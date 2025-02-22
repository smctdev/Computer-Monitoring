import { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTable, useSortBy } from "react-table";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  Breadcrumbs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DevicesIcon from "@mui/icons-material/Devices";

function AllUnits() {
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
        unit.unit_code?.toLowerCase().includes(searchValue) ||
        unit.date_of_purchase?.toLowerCase().includes(searchValue) ||
        unit.description?.toLowerCase().includes(searchValue) ||
        unit.serial_number?.toLowerCase().includes(searchValue) ||
        unit.status?.toLowerCase().includes(searchValue) ||
        unit.supplier.supplier_name?.toLowerCase().includes(searchValue) ||
        unit.category.category_name?.toLowerCase().includes(searchValue) ||
        unit.transfer_units
          .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
          ?.computer_user?.name?.toLowerCase()
          .includes(searchValue?.toLowerCase()) ||
        unit.status?.toLowerCase().includes(searchValue)
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
        const unit = response.data.data;
        setUnits(unit);
      } catch (error) {
        console.error("Error all units:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "UNIT CODE",
        accessor: "unit_code",
      },
      {
        Header: "DATE OF PURCHASE",
        accessor: "date_of_purchase",
      },
      {
        Header: "CATEGORY",
        accessor: "category.category_name",
      },
      {
        Header: "DESCRIPTION",
        accessor: "description",
      },
      {
        Header: "SUPPLIER",
        accessor: "supplier.supplier_name",
      },
      {
        Header: "SERIAL NO.",
        accessor: "serial_number",
      },
      {
        Header: "STATUS",
        accessor: "status",
      },
      {
        Header: "ASSIGNED TO",
        accessor: (row) => {
          const latestTransfer = row.transfer_units.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )[0];
          return latestTransfer?.computer_user?.name || "No user assigned yet";
        },
      },
    ],
    []
  );

  const data = useMemo(() => filteredUnits, [filteredUnits]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <>
      <p className="pt-10 ml-10 text-2xl font-normal">All Units</p>
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
            <DevicesIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            All Units
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
                  <TableCell colSpan={8}>
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
                      <TableCell colSpan={8}>
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
    </>
  );
}

export default AllUnits;
