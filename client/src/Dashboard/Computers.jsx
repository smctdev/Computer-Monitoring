import { useState, useEffect, useMemo, useCallback } from "react";
import { useTable, useSortBy } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faArrowUpRightFromSquare,
  faGears,
  faQrcode,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Specs from "./PopupForComputers/Specs";
import View from "./PopupForComputers/View";
import QrCode from "./PopupForComputers/Qr";
import api from "../api/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  TablePagination,
  TextField,
  Breadcrumbs,
  Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ComputerIcon from "@mui/icons-material/Computer";
import Swal from "sweetalert2";

//THIS IS THE TABLE LIST OF COMPUTERS
export const TableComponent = () => {
  const [isSpecsPopupOpen, setSpecsPopupOpen] = useState(false);
  const [isViewPopupOpen, setViewPopupOpen] = useState(false);
  const [isQrPopupOpen, setQrPopupOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [computerUser, setComputerUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [specsId, setSpecsId] = useState(0);
  const [viewId, setViewId] = useState(0);
  const [qrId, setQrId] = useState(0);

  useEffect(() => {
    const fetchComputerUser = async () => {
      try {
        const response = await api.get("/computer-users");
        const data = response.data.data;
        const userData = data.map((user) => ({
          ...user,
          action: ["Specs", "View", "Qr"],
        }));

        setComputerUser(userData);
        setFilteredData(userData);
      } catch (error) {
        console.error("Error fetching computer users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComputerUser();
  }, [refresh]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterData(value);
  };

  const filterData = (value) => {
    if (!value.trim()) {
      setFilteredData(computerUser);
    } else {
      const filtered = computerUser.filter(
        (item) =>
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.position?.position_name
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item.branch_code.branch_name
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item?.branch_code?.branch_name_english
            ?.toLowerCase()
            .includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openSpecsPopup = useCallback(
    (id) => () => {
      setSpecsId(id);
      setSpecsPopupOpen(!isSpecsPopupOpen);
    },
    [isSpecsPopupOpen]
  );

  const openViewPopup = useCallback(
    (id) => () => {
      setViewId(id);
      setViewPopupOpen(!isViewPopupOpen);
    },
    [isViewPopupOpen]
  );

  const openQrPopup = useCallback(
    (id) => () => {
      setQrId(id);
      setQrPopupOpen(!isQrPopupOpen);
    },
    [isQrPopupOpen]
  );

  const handleDelete = (id) => () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action can't be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleting...",
          text: "Please wait...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        try {
          const response = await api.delete(`computer-user/${id}/delete`);
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: response.data.message,
            });
          }
        } catch (error) {
          console.error("Error deleting computer user:", error);
          if (error.response.status === 403) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response.data,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to delete computer user",
            });
          }
        }
      }
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Branch Code",
        accessor: "branch_code.branch_name",
      },
      {
        Header: "Name",
        accessor: (row) => `${row.name}`,
      },
      {
        Header: "Position",
        accessor: (row) => `${row.position?.position_name}`,
      },
      {
        Header: "Status",
        Cell: ({ row }) => (
          <div
            className={`px-2 py-1 rounded-full capitalize font-bold text-xs ${
              row.original?.status === "active"
                ? "bg-green-500"
                : row.original?.status === "transferred_to_branch"
                ? "bg-blue-500"
                : "bg-orange-300"
            } text-white`}
          >
            {row.original?.status?.replace(/_/g, " ")}
          </div>
        ),
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <div>
            {row.original.action.includes("Specs") && (
              <Tooltip placement="top" title="View Specs" arrow>
                <Button
                  type="button"
                  className="hover:text-blue-500"
                  onClick={openSpecsPopup(row.original.id)}
                >
                  <FontAwesomeIcon icon={faGears} />
                </Button>
              </Tooltip>
            )}
            {row.original.action.includes("View") && (
              <Tooltip placement="top" title="View Details" arrow>
                <Button
                  type="button"
                  className="hover:text-blue-500"
                  onClick={openViewPopup(row.original.id)}
                >
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </Button>
              </Tooltip>
            )}
            {row.original.action.includes("Qr") && (
              <Tooltip placement="top" title="View QR Code" arrow>
                <Button
                  type="button"
                  className="hover:text-blue-500"
                  onClick={openQrPopup(row?.original?.id)}
                >
                  <FontAwesomeIcon icon={faQrcode} />
                </Button>
              </Tooltip>
            )}
            <button
              type="button"
              className="text-red-500"
              onClick={handleDelete(row.original.id)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      },
    ],
    [openSpecsPopup, openViewPopup, openQrPopup]
  );

  const data = useMemo(() => filteredData, [filteredData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  return (
    <>
      {/* search thru NAME */}
      <div className="flex mb-5">
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
      <TableContainer component={Paper} className="table-container">
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow
                className="bg-blue-200"
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column) => (
                  <TableCell
                    align="center"
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
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
              rows
                .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                .map((row) => {
                  prepareRow(row);
                  return (
                    <TableRow {...row.getRowProps()}>
                      {row.cells.map((cell, cellIndex) => (
                        <TableCell
                          align="center"
                          key={cellIndex}
                          className={`${
                            cell.row.original.status === "resigned"
                              ? "bg-red-50"
                              : cell.row.original.computers.length === 0
                              ? "bg-yellow-50"
                              : ""
                          }`}
                          {...cell.getCellProps()}
                        >
                          {cell.row.original.status === "resigned" &&
                            cellIndex === 0 && (
                              <div className="absolute left-0 right-0 w-full mt-5 text-xl font-extrabold text-red-600 animate-pulse">
                                This computer user has already resigned.
                              </div>
                            )}
                          {cell.row.original.computers.length === 0 &&
                            cellIndex === 0 && (
                              <div className="absolute left-0 right-0 w-full mt-5 text-xl font-extrabold text-yellow-600 animate-pulse">
                                This computer user has no computer assigned.
                              </div>
                            )}
                          {cell.render("Cell")}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
            )}
            {!loading && emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5}>
                  {filteredData.length === 0 ? (
                    !searchTerm ? (
                      <p className="text-xl text-center">No user to manage.</p>
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
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => handleChangePage(event, newPage)}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={
            <Typography variant="subtitle" fontWeight={600}>
              Entries Per Page:
            </Typography>
          }
        />
      </TableContainer>
      <Specs
        isOpen={isSpecsPopupOpen}
        onClose={openSpecsPopup(specsId)}
        specsId={specsId}
      />
      <View
        isOpen={isViewPopupOpen}
        viewId={viewId}
        onClose={openViewPopup(viewId)}
        onSubmit={setRefresh}
      />
      <QrCode isOpen={isQrPopupOpen} onClose={openQrPopup(qrId)} qrId={qrId} />
    </>
  );
};

function Computers() {
  return (
    <>
      <p className="pt-10 ml-10 text-2xl font-normal">Managed Computers</p>
      <div className="mt-2 ml-10">
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            to="/dashboard"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="text.primary"
          >
            <ComputerIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Computers
          </Typography>
        </Breadcrumbs>
      </div>
      <br /> <br />
      <div className="h-full ml-10 w-12/12">
        <div className="max-h-full mt-4 w-12/12">
          <div>
            <TableComponent />
          </div>
        </div>
      </div>
    </>
  );
}

export default Computers;
