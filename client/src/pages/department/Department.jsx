import { useState, useEffect, useMemo, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTable, useSortBy } from "react-table";
import {
  faArrowDown,
  faArrowUp,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import api from "../../api/axios";
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
import { format } from "date-fns";
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AddDepartmentModal from "../../components/modals/AddDepartmentModal";
import Swal from "sweetalert2";
import EditDepartmentModal from "../../components/modals/EditDepartmentModal";

function Department() {
  const [Departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [departmentId, setDepartmentId] = useState(null);
  const buttonRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutSide);

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [modalRef, buttonRef]);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (id) => {
    setIsEditModalOpen(true);
    setDepartmentId(id);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  useEffect(() => {
    setFilteredDepartments(Departments);
  }, [Departments]);

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filteredData = Departments.filter(
      (department) =>
        department.department_name.toLowerCase().includes(searchValue) ||
        department.id.toString().toLowerCase().includes(searchValue) ||
        department.branch_code.branch_name
          .toString()
          .toLowerCase()
          .includes(searchValue) ||
        department.created_at.toLowerCase().includes(searchValue)
    );

    setFilteredDepartments(filteredData);
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
    const fetchDepartments = async () => {
      try {
        const response = await api.get("/departments");
        const departments = response.data.departments;

        setDepartments(departments);
      } catch (error) {
        console.error("Error all Department:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [isRefresh]);

  const handleDelete = async (id) => {
    setIsRefresh(true);
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action can't be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        const response = await api.delete(`department-delete/${id}`);

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: response.data.message,
            confirmButtonColor: "#808080",
            confirmButtonText: "Close",
          });
        } else {
          throw new Error("Failed to delete");
        }
      }
    } catch (error) {
      console.error("Error deleting Department:", error);
      if (error.response.status === 422) {
        Swal.fire({
          icon: "warning",
          title: "Warning!",
          text: error.response.data.message,
          confirmButtonColor: "#808080",
          confirmButtonText: "Close",
        });
      } else {
        throw new Error("Failed to delete");
      }
    } finally {
      setIsRefresh(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({ value }) => value,
        sortType: "basic",
      },
      {
        Header: "Department",
        accessor: "department_name",
        sortType: "basic",
      },
      {
        Header: "Branch Code",
        accessor: "branch_code",
        Cell: ({ value }) => value.branch_name,
        sortType: "basic",
      },
      {
        Header: "Date",
        accessor: "created_at",
        Cell: ({ value }) => format(new Date(value), "MMMM d, yyyy"),
        sortType: "basic",
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => openEditModal(row.original.id)}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FontAwesomeIcon icon={faPen} /> Edit
            </button>

            <button
              onClick={() => handleDelete(row.original.id)}
              className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <FontAwesomeIcon icon={faTrash} /> Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => filteredDepartments, [filteredDepartments]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  return (
    <>
      <p className="pt-10 ml-10 text-2xl font-normal">All Department</p>
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
            <ApartmentIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            All Department
          </Typography>
        </Breadcrumbs>
      </div>
      <br /> <br />
      <div className="h-full ml-10 mr-10">
        {/* Search bar */}
        <div className="flex items-center justify-between">
          <div>
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
          </div>
          <div>
            <button
              onClick={openAddModal}
              type="button"
              ref={buttonRef}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FontAwesomeIcon icon={faPlus} /> Add Department
            </button>
          </div>
        </div>
        <TableContainer className="mt-1 bg-white rounded-lg shadow-md">
          <Table {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow
                  className="bg-blue-400"
                  {...headerGroup.getHeaderGroupProps()}
                >
                  {headerGroup.headers.map((column) => (
                    <TableCell
                      align="center"
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      style={{ cursor: "pointer" }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color={"white"}
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
                          <TableCell align="center" {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
              )}
              {!loading && filteredDepartments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {searchTerm
                      ? `No "${searchTerm}" result found.`
                      : "No data found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 15, 20]}
            component="div"
            count={filteredDepartments.length}
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
      <AddDepartmentModal
        modalRef={modalRef}
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        isRefresh={setIsRefresh}
      />
      <EditDepartmentModal
        modalRef={modalRef}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        isRefresh={setIsRefresh}
        id={departmentId}
      />
    </>
  );
}

export default Department;
