import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Checkbox,
  TextField,
  Autocomplete,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { TablePagination } from "@mui/material";
import Swal from "sweetalert2";
import api from "../../../api/axios";
import { format } from "date-fns";

function Add({ isOpen, onClose, onSubmit, refresh }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [vacantUnit, setVacantUnit] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [checkedRows, setCheckedRows] = useState([]);
  const [department, setDepartment] = useState({ departments: [] });
  const [branch, setBranch] = useState({ data: [] });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [branchUnit, setBranchUnit] = useState({
    branch: "",
    department: "",
  });
  const [vloading, setvLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    setFilteredData(vacantUnit);
  }, [vacantUnit]);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await api.get("/units");
        setVacantUnit(response.data.vacant || []);
        setvLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setvLoading(false);
      }
    };

    fetchUnit();
  }, [refresh]);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await api.get("/departments");
        setDepartment(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDepartment();
  }, []);

  useEffect(() => {
    const fetchBranchCode = async () => {
      try {
        const response = await api.get("/branches");
        setBranch(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBranchCode();
  }, []);

  const Department =
    department.departments && department.departments.length > 0
      ? department.departments
          .filter(
            (department) => department.branch_code_id === branchUnit.branch
          )
          .map((dept) => ({
            id: dept.id,
            name: dept.department_name,
          }))
          .sort((a, b) => {
            if (a.name === "N/A" && b.name !== "N/A") return -1;
            if (b.name === "N/A" && a.name !== "N/A") return 1;

            return a.name.localeCompare(b.name);
          })
      : [];

  const Branch =
    branch.branches && branch.branches.length > 0
      ? branch.branches
          .map((item) => ({
            id: item.id,
            name: `${item.branch_name_english} (${item.branch_name})`,
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
      : [];

  const handleCheckboxClick = (unitId) => {
    if (checkedRows.includes(unitId)) {
      setCheckedRows(checkedRows.filter((id) => id !== unitId));
    } else {
      setCheckedRows([...checkedRows, unitId]);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterData(value);
  };

  const filterData = (value) => {
    if (!value.trim()) {
      setFilteredData(vacantUnit);
    } else {
      const filtered = vacantUnit.filter(
        (item) =>
          item.category.category_name
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item.unit_code.toLowerCase().includes(value.toLowerCase()) ||
          item.supplier.supplier_name
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item.description.toLowerCase().includes(value.toLowerCase()) ||
          item.serial_number.toLowerCase().includes(value.toLowerCase()) ||
          item.date_of_purchase.toLowerCase().includes(value.toLowerCase())
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

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);

  if (!isOpen) {
    return null;
  }

  const handleSubmitAssignedUser = async (event) => {
    event.preventDefault();
    onSubmit(true);
    setLoading(true);
    try {
      const response = await api.post("/add-branch-unit", {
        checkedRows: checkedRows,
        branch: branchUnit.branch,
        department: branchUnit.department,
      });
      if (response.data.status === true) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "green",
          customClass: {
            popup: "colored-toast",
          },
          showConfirmButton: false,
          showCloseButton: true,
          timer: 2500,
          timerProgressBar: true,
        });
        (async () => {
          await Toast.fire({
            icon: "success",
            title: response.data.message,
          });
        })();
        setCheckedRows("");
        setBranchUnit("");
        onClose();
      }
    } catch (error) {
      console.error("Error in adding branch unit:", error);
      if (error.response && error.response.data) {
        console.error("Backend error response:", error.response.data);
        setValidationErrors(error.response.data.errors || {});
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "red",
          customClass: {
            popup: "colored-toast",
          },
          showConfirmButton: false,
          showCloseButton: true,
          timer: 2500,
          timerProgressBar: true,
        });
        (async () => {
          await Toast.fire({
            icon: "error",
            title: error.response.data.message,
          });
        })();
      } else {
        console.error("ERROR!");
      }
    } finally {
      onSubmit(false);
      setLoading(false);
    }
  };

  const sortRows = (rows) => {
    return rows.sort((a, b) => {
      let valueA, valueB;

      if (sortColumn === "unit_code") {
        valueA = a.unit_code;
        valueB = b.unit_code;
      } else if (sortColumn === "date_of_purchase") {
        valueA = a.date_of_purchase;
        valueB = b.date_of_purchase;
      } else if (sortColumn === "description") {
        valueA = a.description.toLowerCase();
        valueB = b.description.toLowerCase();
      } else if (sortColumn === "supplier.supplier_name") {
        valueA = a.supplier.supplier_name.toLowerCase();
        valueB = b.supplier.supplier_name.toLowerCase();
      } else if (sortColumn === "category.category_name") {
        valueA = a.category.category_name.toLowerCase();
        valueB = b.category.category_name.toLowerCase();
      } else if (sortColumn === "serial_number") {
        valueA = a.serial_number.toLowerCase();
        valueB = b.serial_number.toLowerCase();
      } else if (sortColumn === "status") {
        valueA = a.status.toLowerCase();
        valueB = b.status.toLowerCase();
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

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setCheckedRows(filteredData.map((unit) => unit.id));
    } else {
      setCheckedRows([]);
    }
  };

  const isAllChecked =
    filteredData.length > 0 &&
    filteredData.every((unit) => checkedRows.includes(unit.id));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-800 bg-opacity-50 h-screen">
      <form onSubmit={handleSubmitAssignedUser}>
        <div className="flex-none w-full mx-auto overflow-hidden bg-white rounded-t-xl">
          <TableContainer
            component={Paper}
            style={{
              maxHeight: "80vh",
            }}
          >
            <Table className="max-h-[80vh]">
              <TableHead className="sticky top-0 z-50">
                <TableRow className="bg-[#FF6600]">
                  <TableCell align="center">
                    <Checkbox
                      checked={isAllChecked}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    align="center"
                    onClick={() => handleSort("unit_code")}
                  >
                    <Typography
                      variant="subtitle1"
                      style={{ fontWeight: 700 }}
                      className="text-white"
                    >
                      UNIT CODE{" "}
                      {sortColumn === "unit_code" &&
                        (sortOrder === "asc" ? (
                          <FontAwesomeIcon icon={faArrowDown} />
                        ) : (
                          <FontAwesomeIcon icon={faArrowUp} />
                        ))}
                    </Typography>
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    align="center"
                    onClick={() => handleSort("date_of_purchase")}
                  >
                    <Typography
                      variant="subtitle1"
                      style={{ fontWeight: 700 }}
                      className="text-white"
                    >
                      DATE OF PURCHASE{" "}
                      {sortColumn === "date_of_purchase" &&
                        (sortOrder === "asc" ? (
                          <FontAwesomeIcon icon={faArrowDown} />
                        ) : (
                          <FontAwesomeIcon icon={faArrowUp} />
                        ))}
                    </Typography>
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    align="center"
                    onClick={() => handleSort("category.category_name")}
                  >
                    <Typography
                      variant="subtitle1"
                      style={{ fontWeight: 700 }}
                      className="text-white"
                    >
                      CATEGORY{" "}
                      {sortColumn === "category.category_name" &&
                        (sortOrder === "asc" ? (
                          <FontAwesomeIcon icon={faArrowDown} />
                        ) : (
                          <FontAwesomeIcon icon={faArrowUp} />
                        ))}
                    </Typography>
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    align="center"
                    onClick={() => handleSort("description")}
                  >
                    <Typography
                      variant="subtitle1"
                      style={{ fontWeight: 700 }}
                      className="text-white"
                    >
                      DESCRIPTION{" "}
                      {sortColumn === "description" &&
                        (sortOrder === "asc" ? (
                          <FontAwesomeIcon icon={faArrowDown} />
                        ) : (
                          <FontAwesomeIcon icon={faArrowUp} />
                        ))}
                    </Typography>
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    align="center"
                    onClick={() => handleSort("supplier.supplier_name")}
                  >
                    <Typography
                      variant="subtitle1"
                      style={{ fontWeight: 700 }}
                      className="text-white"
                    >
                      SUPPLIER{" "}
                      {sortColumn === "supplier.supplier_name" &&
                        (sortOrder === "asc" ? (
                          <FontAwesomeIcon icon={faArrowDown} />
                        ) : (
                          <FontAwesomeIcon icon={faArrowUp} />
                        ))}
                    </Typography>
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    align="center"
                    onClick={() => handleSort("serial_number")}
                  >
                    <Typography
                      variant="subtitle1"
                      style={{ fontWeight: 700 }}
                      className="text-white"
                    >
                      SERIAL NO.{" "}
                      {sortColumn === "serial_number" &&
                        (sortOrder === "asc" ? (
                          <FontAwesomeIcon icon={faArrowDown} />
                        ) : (
                          <FontAwesomeIcon icon={faArrowUp} />
                        ))}
                    </Typography>
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    align="center"
                    onClick={() => handleSort("status")}
                  >
                    <Typography
                      variant="subtitle1"
                      style={{ fontWeight: 700 }}
                      className="text-white"
                    >
                      STATUS{" "}
                      {sortColumn === "status" &&
                        (sortOrder === "asc" ? (
                          <FontAwesomeIcon icon={faArrowDown} />
                        ) : (
                          <FontAwesomeIcon icon={faArrowUp} />
                        ))}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vloading ? (
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
                  sortRows(filteredData)
                    .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                    .map((un, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">
                          <Checkbox
                            checked={checkedRows.includes(un.id)}
                            onChange={() => handleCheckboxClick(un.id)}
                            sx={
                              validationErrors.checkedRows
                                ? {
                                    "& .MuiSvgIcon-root": {
                                      border: "2px solid",
                                      borderColor: "red",
                                      borderRadius: "4px",
                                    },
                                    "&.Mui-checked .MuiSvgIcon-root": {
                                      borderColor: "secondary.main",
                                    },
                                  }
                                : {}
                            }
                          />
                          <br />
                          {validationErrors.checkedRows ? (
                            <p className="text-xs text-red-500">
                              Please check one or more first.
                            </p>
                          ) : (
                            ""
                          )}
                        </TableCell>
                        <TableCell align="center">{un.unit_code}</TableCell>
                        <TableCell align="center">
                          {format(new Date(un.date_of_purchase), "yyyy-MM-dd")}
                        </TableCell>
                        <TableCell align="center">
                          {un.category.category_name}
                        </TableCell>
                        <TableCell align="center">
                          {un.description.split("\n").map((line, lineIndex) => (
                            <div key={lineIndex}>{line}</div>
                          ))}
                        </TableCell>
                        <TableCell align="center">
                          {un.supplier.supplier_name}
                        </TableCell>
                        <TableCell align="center">{un.serial_number}</TableCell>
                        <TableCell align="center">{un.status}</TableCell>
                      </TableRow>
                    ))
                )}

                {vloading
                  ? ""
                  : emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={8}>
                          {filteredData.length === 0 ? (
                            !searchTerm ? (
                              <p className="text-xl text-center">
                                No vacant units found.
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
              className="sticky bottom-0 bg-white"
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) =>
                handleChangePage(event, newPage)
              }
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={
                <Typography variant="subtitle" fontWeight={600}>
                  Entries Per Page:{" "}
                </Typography>
              }
            />
          </TableContainer>
        </div>
        <div className="flex items-center justify-between space-x-4 bg-white">
          <div className="flex items-center gap-2">
            <Autocomplete
              freeSolo
              id="user"
              disableClearable
              options={Branch}
              getOptionLabel={(option) => (option.name ? option.name : "")}
              readOnly={Branch.length === 0}
              renderInput={(params) => (
                <TextField
                  required
                  {...params}
                  label={
                    Branch.length === 0
                      ? "No branch to select"
                      : "Assign Branch"
                  }
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                  sx={{ width: 300 }}
                  variant="outlined"
                  style={{
                    marginLeft: "20px",
                    marginTop: "20px",
                    marginBottom: "20px",
                    width: "300px",
                  }}
                />
              )}
              value={
                Branch.find((option) => option.id === branchUnit.branch) || {}
              }
              onChange={(event, newValue) => {
                setBranchUnit({ ...branchUnit, branch: newValue.id });
              }}
            />
            <Autocomplete
              freeSolo
              id="user"
              disableClearable
              options={Department}
              getOptionLabel={(option) => (option.name ? option.name : "")}
              readOnly={Department.length === 0}
              renderInput={(params) => (
                <TextField
                  required
                  {...params}
                  label={
                    Department.length === 0
                      ? "Select branch first"
                      : "Pick Department"
                  }
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                  sx={{ width: 300 }}
                  variant="outlined"
                  style={{
                    marginLeft: "20px",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                />
              )}
              value={
                Department.find(
                  (option) => option.id === branchUnit.department
                ) || {}
              }
              onChange={(event, newValue) => {
                setBranchUnit({ ...branchUnit, department: newValue.id });
              }}
            />
            <TextField
              label="Search Unit"
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              fullWidth
              sx={{ width: 100 }}
              size="small"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className="flex items-end justify-end px-5 text-center">
            <button
              className="w-24 h-8 text-sm font-semibold bg-gray-200 rounded-full"
              onClick={onClose}
            >
              CANCEL
            </button>
            {filteredData.length === 0 ? (
              <button
                disabled
                type="submit"
                className="w-24 h-8 ml-3 text-sm font-semibold text-white bg-green-300 rounded-full cursor-not-allowed"
              >
                {loading ? "ADDING..." : "ADD"}
              </button>
            ) : (
              <button
                disabled={loading || checkedRows.length === 0}
                type="submit"
                className={
                  loading || checkedRows.length === 0
                    ? "w-24 h-8 ml-3 text-sm font-semibold text-white bg-green-300 rounded-full cursor-not-allowed"
                    : "w-24 h-8 ml-3 text-sm font-semibold text-white bg-green-600 rounded-full"
                }
              >
                {loading ? "ADDING..." : "ADD"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Add;
