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
  Autocomplete,
  TextField,
  Button,
  Modal,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Checkbox,
  Grid,
  Select as MuiSelect,
  Tooltip,
} from "@mui/material";
import Swal from "sweetalert2";
import Select from "react-select";
import api from "../../../api/axios";
import { format } from "date-fns";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faX,
  faFloppyDisk,
  faSpinner,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};

function EditSet({ isOpen, onClose, editId, onSubmit }) {
  const [branch, setBranch] = useState({ data: [] });
  const [department, setDepartment] = useState({ data: [] });
  const [branchUnit, setBranchUnit] = useState({
    branch: "",
    department: "",
  });
  const [loading, setLoading] = useState(true);
  const [branchUnitName, setBranchUnitName] = useState("");
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [transferDate, setTransferDate] = useState(null);
  const [sloading, setsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [checkedRows, setCheckedRows] = useState([]);
  const [branchUnitId, setBranchUnitId] = useState("");
  const [unit, setUnit] = useState([]);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editUnitId, setEditUnitId] = useState(null);
  const [category, setCategory] = useState({ data: [] });
  const [supplier, setSupplier] = useState({ data: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [branchData, setBranchData] = useState(0);
  const [editValues, setEditValues] = useState({
    date_of_purchase: "",
    category: "",
    description: "",
    supplier: "",
    serial_number: "",
    status: "",
  });
  const options = [
    { value: "Used", label: "Used" },
    { value: "Defective", label: "Defective" },
  ];
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!editId || !isOpen) {
      return;
    }
    const fetchEditData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/branch-unit-edit/${editId}`);
        if (response.status === 200) {
          setBranchData(response.data.branch_unit_data);
          const allUnits = response.data.branch_unit_data.branch_units.map(
            (branchUnit) => ({
              unit: branchUnit.unit,
              department: branchUnit.department,
            })
          );

          setUnit(allUnits);
          const name = `${response.data.branch_unit_data.branch_name_english} (${response.data.branch_unit_data.branch_name})`;
          const id =
            response.data.branch_unit_data.branch_units[0].branch_code_id;
          setBranchUnitName(name);
          setBranchUnitId(id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEditData();
  }, [editId, isOpen]);

  const handleCheckboxClick = (unitId) => {
    if (checkedRows.includes(unitId)) {
      setCheckedRows(checkedRows.filter((id) => id !== unitId));
    } else {
      setCheckedRows([...checkedRows, unitId]);
    }
  };

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await api.get("/branches");
        setBranch(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchBranch();
  }, []);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await api.get("/departments");
        setDepartment(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchDepartment();
  }, []);

  const Branch =
    branch.branches && branch.branches.length > 0
      ? branch.branches
          .filter((bu) => bu.id !== branchData.id)
          .map((bu) => ({
            id: bu.id,
            name: `${bu.branch_name_english} (${bu.branch_name})`,
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
      : [];
  const Department =
    department.departments && department.departments.length > 0
      ? department.departments
          .filter((dept) => dept.branch_code_id === branchUnit.branch)
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

  const handleUpdateUnit = (id, data) => {
    setEditUnitId(id);
    setEditValues({
      ...editValues,
      date_of_purchase: data.unit.date_of_purchase ?? "",
      category: {
        label: data.unit.category.category_name,
        value: data.unit.category.id,
      },
      description: data.unit.description,
      supplier: {
        label: data.unit.supplier.supplier_name,
        value: data.unit.supplier.id,
      },
      serial_number: data.unit.serial_number,
      status: { label: data.unit.status, value: data.unit.status },
    });
    setValidationErrors({});
  };

  const formatEditValues = (values) => ({
    date_of_purchase: values.date_of_purchase,
    category: values.category.value,
    description: values.description,
    supplier: values.supplier.value,
    serial_number: values.serial_number,
    status: values.status.value,
  });

  const handleEditDateChange = (date) => {
    setEditValues({
      ...editValues,
      date_of_purchase: date,
    });
  };

  const handleSelectChange = (selectedOption, field) => {
    setEditValues({
      ...editValues,
      [field]: selectedOption,
    });
  };
  const handleSaveUnit = async (id) => {
    setLoadingUpdate(true);
    onSubmit(true);
    try {
      const formattedValues = formatEditValues(editValues);

      const response = await api.post(`/update-unit/${id}`, formattedValues);

      if (response.status === 200) {
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

        handleCancelEdit();
        onClose();
      }
    } catch (error) {
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
      }
    } finally {
      setLoadingUpdate(false);
      onSubmit(false);
    }
  };

  const handleCancelEdit = () => {
    setEditUnitId(null);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get("/categories");
        setCategory(response?.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await api.get("/suppliers");
        setSupplier(response?.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchSupplier();
  }, []);

  const filteredUnits = unit
    ? unit.filter(
        (unit) =>
          unit?.unit?.unit_code
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          unit?.unit?.date_of_purchase
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          unit?.unit?.category?.category_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          unit?.unit?.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          unit?.unit?.supplier?.supplier_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          unit?.unit?.serial_number
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          unit?.unit?.status
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          unit?.department?.department_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : [];

  const Category = category.data?.map((cat) => ({
    label: cat.category_name,
    value: cat.id,
  }));

  const Supplier = supplier.data?.map((sup) => ({
    label: sup.supplier_name,
    value: sup.id,
  }));

  if (!isOpen) {
    return null;
  }

  const handleSubmitEditedSet = async (e) => {
    e.preventDefault();
    setsLoading(true);
    onSubmit(true);

    try {
      const response = await api.post(
        `/branch-unit/${branchUnitId}/unit/action`,
        {
          action: reason,
          branch: branchUnit.branch,
          department: branchUnit.department,
          date: transferDate || null,
          checkRows: checkedRows,
        }
      );

      if (response.status === 200) {
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
        setCheckedRows([]);
        setTransferDate(null);
        setReason("");
        setBranchUnit([]);
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
            container: "swalContainer",
          },
          showConfirmButton: false,
          showCloseButton: true,
          timer: 2500,
          timerProgressBar: true,
        });

        await Toast.fire({
          icon: "error",
          title: error.response.data.message,
        });
      } else {
        console.error("Error submit:", error);
      }
    } finally {
      setsLoading(false);
      onSubmit(false);
    }
  };

  const handleDateChange = (newDate) => {
    setTransferDate(dayjs(newDate).format("YYYY-MM-DD"));
  };

  const handleSearchTerm = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };
  const sortRows = (rows) => {
    return rows.sort((a, b) => {
      let valueA, valueB;

      if (sortColumn === "unit_code") {
        valueA = a.unit.unit_code;
        valueB = b.unit.unit_code;
      } else if (sortColumn === "date_of_purchase") {
        valueA = a.unit.date_of_purchase;
        valueB = b.unit.date_of_purchase;
      } else if (sortColumn === "description") {
        valueA = a.unit.description.toLowerCase();
        valueB = b.unit.description.toLowerCase();
      } else if (sortColumn === "supplier.supplier_name") {
        valueA = a.unit.supplier.supplier_name.toLowerCase();
        valueB = b.unit.supplier.supplier_name.toLowerCase();
      } else if (sortColumn === "category.category_name") {
        valueA = a.unit.category.category_name.toLowerCase();
        valueB = b.unit.category.category_name.toLowerCase();
      } else if (sortColumn === "serial_number") {
        valueA = a.unit.serial_number.toLowerCase();
        valueB = b.unit.serial_number.toLowerCase();
      } else if (sortColumn === "status") {
        valueA = a.unit.status.toLowerCase();
        valueB = b.unit.status.toLowerCase();
      } else if (sortColumn === "department_name") {
        valueA = a.department.department_name.toLowerCase();
        valueB = b.department.department_name.toLowerCase();
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
      setCheckedRows(filteredUnits.map((unit) => unit.unit.id));
    } else {
      setCheckedRows([]);
    }
  };

  const isAllChecked =
    filteredUnits.length > 0 && filteredUnits.every((unit) => checkedRows.includes(unit.unit.id));
  return (
    <>
      <div className="fixed inset-0 flex items-center z-[60] justify-center bg-gray-800 bg-opacity-40">
        <div
          className="bg-white shadow-md rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-xl"
          style={{
            minWidth: "90%",
            maxWidth: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
            margin: "0 auto",
          }}
        >
          <div className="max-h-[85vh] overflow-hidden text-justify">
            <TableContainer
              component={Paper}
              style={{
                maxHeight: "75vh",
              }}
            >
              <Table className="max-h-[80vh]">
                <TableHead className="sticky top-0 z-50">
                  <TableRow className="bg-red-200">
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
                    <TableCell
                      className="cursor-pointer"
                      align="center"
                      onClick={() => handleSort("department_name")}
                    >
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: 700 }}
                      >
                        ASSIGNED DEPARTMENT
                        {sortColumn === "department_name" &&
                          (sortOrder === "asc" ? (
                            <FontAwesomeIcon icon={faArrowDown} />
                          ) : (
                            <FontAwesomeIcon icon={faArrowUp} />
                          ))}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: 700 }}
                      >
                        ACTION
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10}>
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
                    sortRows(filteredUnits).map((unit, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">
                          <Checkbox
                            checked={checkedRows.includes(unit.unit.id)}
                            onChange={() => handleCheckboxClick(unit.unit.id)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {unit.unit.unit_code}
                        </TableCell>
                        <TableCell align="center">
                          {editUnitId === unit.unit.id ? (
                            <>
                              <DatePicker
                                selected={editValues?.date_of_purchase}
                                onChange={handleEditDateChange}
                                placeholderText=""
                                dateFormat={"yyyy-MM-dd"}
                                className={
                                  editUnitId === unit.unit.id &&
                                  validationErrors["date_of_purchase"]
                                    ? "bg-gray-200 border border-red-500 rounded-xl w-4/4 h-9 pl-2"
                                    : "bg-gray-200 border border-transparent rounded-xl w-4/4 h-9 pl-2"
                                }
                              />
                            </>
                          ) : (
                            <>
                              {format(
                                new Date(unit.unit.date_of_purchase),
                                "yyyy-MM-dd"
                              )}
                            </>
                          )}
                          <span className="text-sm text-center">
                            {editUnitId === unit.unit.id &&
                              validationErrors["date_of_purchase"] && (
                                <div className="text-sm text-center text-red-500">
                                  {validationErrors["date_of_purchase"].map(
                                    (error, errorIndex) => (
                                      <span key={errorIndex}>{error}</span>
                                    )
                                  )}
                                </div>
                              )}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          {editUnitId === unit.unit.id ? (
                            <Select
                              options={Category}
                              value={editValues?.category}
                              onChange={(e) =>
                                handleSelectChange(e, "category")
                              }
                              placeholder={
                                editValues?.category ? "" : "Select Category"
                              }
                              className={
                                editUnitId === unit.unit.id &&
                                validationErrors["category"]
                                  ? "border border-red-500"
                                  : "border border-transparent"
                              }
                            />
                          ) : unit.unit.category ? (
                            unit.unit.category.category_name
                          ) : (
                            "N/A"
                          )}
                          <span className="text-sm text-center">
                            {editUnitId === unit.unit.id &&
                              validationErrors["category"] && (
                                <div className="text-sm text-center text-red-500">
                                  {validationErrors["category"].map(
                                    (error, errorIndex) => (
                                      <span key={errorIndex}>{error}</span>
                                    )
                                  )}
                                </div>
                              )}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          {editUnitId === unit.unit.id ? (
                            <textarea
                              rows={3}
                              type="text"
                              value={editValues?.description || ""}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  description: e.target.value,
                                })
                              }
                              className={
                                editUnitId === unit.unit.id &&
                                validationErrors["description"]
                                  ? "bg-gray-200 border border-red-500 rounded-xl w-4/4 pl-2"
                                  : "bg-gray-200 border border-transparent rounded-xl w-4/4 pl-2"
                              }
                            />
                          ) : (
                            unit?.unit.description
                              .split("\n")
                              .map((line, lineIndex) => (
                                <div key={lineIndex}>{line}</div>
                              ))
                          )}
                          <span className="text-sm text-center">
                            {editUnitId === unit.unit.id &&
                              validationErrors["description"] && (
                                <div className="text-sm text-center text-red-500">
                                  {validationErrors["description"].map(
                                    (error, errorIndex) => (
                                      <span key={errorIndex}>{error}</span>
                                    )
                                  )}
                                </div>
                              )}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          {editUnitId === unit.unit.id ? (
                            <Select
                              options={Supplier}
                              value={editValues?.supplier}
                              onChange={(e) =>
                                handleSelectChange(e, "supplier")
                              }
                              placeholder={
                                editValues?.supplier ? "" : "Select Supplier"
                              }
                              className={
                                editUnitId === unit.unit.id &&
                                validationErrors["supplier"]
                                  ? "border border-red-500"
                                  : "border border-transparent"
                              }
                            />
                          ) : unit.unit.supplier ? (
                            unit.unit.supplier.supplier_name
                          ) : (
                            "N/A"
                          )}
                          <span className="text-sm text-center">
                            {editUnitId === unit.unit.id &&
                              validationErrors["supplier"] && (
                                <div className="text-sm text-center text-red-500">
                                  {validationErrors["supplier"].map(
                                    (error, errorIndex) => (
                                      <span key={errorIndex}>{error}</span>
                                    )
                                  )}
                                </div>
                              )}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          {editUnitId === unit.unit.id ? (
                            <input
                              type="text"
                              value={editValues?.serial_number || null}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  serial_number: e.target.value,
                                })
                              }
                              placeholder=""
                              className={
                                editUnitId === unit.unit.id &&
                                validationErrors["serial_number"]
                                  ? "bg-gray-200 border border-red-500 rounded-xl w-4/4 h-9 pl-2"
                                  : "bg-gray-200 border border-transparent rounded-xl w-4/4 h-9 pl-2"
                              }
                            />
                          ) : (
                            unit.unit.serial_number
                          )}
                          <span className="text-sm text-center">
                            {editUnitId === unit.unit.id &&
                              validationErrors["serial_number"] && (
                                <div className="text-sm text-center text-red-500">
                                  {validationErrors["serial_number"].map(
                                    (error, errorIndex) => (
                                      <span key={errorIndex}>{error}</span>
                                    )
                                  )}
                                </div>
                              )}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          {editUnitId === unit.unit.id ? (
                            <Select
                              options={options}
                              value={editValues?.status || null}
                              onChange={(e) => handleSelectChange(e, "status")}
                              placeholder={
                                editValues?.status ? "" : "Select status"
                              }
                              className={
                                editUnitId === unit.unit.id &&
                                validationErrors["status"]
                                  ? "border border-red-500"
                                  : "border border-transparent"
                              }
                            />
                          ) : (
                            unit.unit.status
                          )}
                          <span className="text-sm text-center">
                            {editUnitId === unit.unit.id &&
                              validationErrors["status"] && (
                                <div className="text-sm text-center text-red-500">
                                  {validationErrors["status"].map(
                                    (error, errorIndex) => (
                                      <span key={errorIndex}>{error}</span>
                                    )
                                  )}
                                </div>
                              )}
                          </span>
                        </TableCell>
                        <TableCell
                          align="center"
                          className={
                            editUnitId === unit.unit.id
                              ? "cursor-not-allowed"
                              : ""
                          }
                        >
                          {unit.department.department_name}
                        </TableCell>
                        <TableCell align="center">
                          {editUnitId === unit.unit.id ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "0.25rem",
                              }}
                            >
                              <Tooltip title="Save" arrow placement="top">
                                <button
                                  type="button"
                                  className="hover:scale-110"
                                  onClick={() => handleSaveUnit(unit.unit.id)}
                                  style={{
                                    padding: "0.5rem 1rem",
                                    fontWeight: "600",
                                    color: "white",
                                    background:
                                      "linear-gradient(to right, #48C774, #1E90FF)",
                                    borderRadius: "0.375rem",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    transition:
                                      "background-color 0.3s ease, transform 0.3s ease",
                                    outline: "none",
                                  }}
                                  onMouseOver={(e) =>
                                    (e.currentTarget.style.background =
                                      "linear-gradient(to right, #36D759, #1C86EE)")
                                  }
                                  onMouseOut={(e) =>
                                    (e.currentTarget.style.background =
                                      "linear-gradient(to right, #48C774, #1E90FF)")
                                  }
                                >
                                  {loadingUpdate ? (
                                    <FontAwesomeIcon
                                      className="animate-spin"
                                      icon={faSpinner}
                                    />
                                  ) : (
                                    <FontAwesomeIcon icon={faFloppyDisk} />
                                  )}
                                </button>
                              </Tooltip>
                              <Tooltip title="Cancel" arrow placement="top">
                                <button
                                  type="button"
                                  className="hover:scale-110"
                                  onClick={handleCancelEdit}
                                  style={{
                                    padding: "0.5rem 1rem",
                                    fontWeight: "600",
                                    color: "white",
                                    background:
                                      "linear-gradient(to right, #FF4D4D, #FF007F)",
                                    borderRadius: "0.375rem",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    transition:
                                      "background-color 0.3s ease, transform 0.3s ease",
                                    outline: "none",
                                  }}
                                  onMouseOver={(e) =>
                                    (e.currentTarget.style.background =
                                      "linear-gradient(to right, #FF3B3B, #FF0055)")
                                  }
                                  onMouseOut={(e) =>
                                    (e.currentTarget.style.background =
                                      "linear-gradient(to right, #FF4D4D, #FF007F)")
                                  }
                                >
                                  <FontAwesomeIcon icon={faX} />
                                </button>
                              </Tooltip>
                            </div>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "0.25rem",
                              }}
                            >
                              <Tooltip title="Edit" arrow placement="top">
                                <button
                                  className="hover:scale-110"
                                  type="button"
                                  onClick={() =>
                                    handleUpdateUnit(unit.unit.id, unit)
                                  }
                                  style={{
                                    padding: "0.5rem 1rem",
                                    fontWeight: "600",
                                    color: "white",
                                    background:
                                      "linear-gradient(to right, #1E90FF, #1E90FE)",
                                    borderRadius: "0.375rem",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    transition:
                                      "background-color 0.3s ease, transform 0.3s ease",
                                    outline: "none",
                                  }}
                                  onMouseOver={(e) =>
                                    (e.currentTarget.style.background =
                                      "linear-gradient(to right, #1C86EE, #1E90FE)")
                                  }
                                  onMouseOut={(e) =>
                                    (e.currentTarget.style.background =
                                      "linear-gradient(to right, #1E90FF, #1E90FE)")
                                  }
                                >
                                  <FontAwesomeIcon icon={faPen} />
                                </button>
                              </Tooltip>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}

                  {filteredUnits.length <= 0 && (
                    <TableCell align="center" colSpan={10}>
                      {searchTerm && `No results found for "${searchTerm}"`}
                    </TableCell>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="flex items-center justify-between">
              <div className="flex items-center w-full gap-2 p-5">
                {loading ? (
                  "Loading..."
                ) : (
                  <>
                    <p className="text-xl text-center">
                      <strong>{branchUnitName}&apos;s</strong> units
                    </p>
                  </>
                )}
                <div class="relative w-full max-w-xs">
                  <input
                    type="search"
                    placeholder="Search..."
                    onChange={handleSearchTerm}
                    value={searchTerm}
                    class="w-full px-4 py-2 pl-10 pr-4 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 0l6 6"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="flex items-end justify-end px-5 ml-48 text-center">
                <button
                  type="button"
                  className="w-24 h-8 text-sm font-semibold bg-gray-200 rounded-full"
                  onClick={onClose}
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleOpen}
                  className={
                    checkedRows.length === 0
                      ? "w-24 h-8 ml-3 text-sm font-semibold text-white bg-blue-300 rounded-full cursor-not-allowed"
                      : "w-24 h-8 ml-3 text-sm font-semibold text-white bg-blue-600 rounded-full"
                  }
                  disabled={checkedRows.length === 0}
                >
                  {checkedRows.length === 0 ? "UPDATE" : "UPDATE"}
                </button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  BackdropProps={{
                    onClick: (e) => e.stopPropagation(),
                  }}
                >
                  <form onSubmit={handleSubmitEditedSet}>
                    <Box sx={style}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        Why did you update this unit?
                      </Typography>
                      <Box sx={{ minWidth: 120, marginTop: 2 }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            State the reason for the action...
                          </InputLabel>
                          <MuiSelect
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={reason}
                            label="State the reason for the action..."
                            onChange={(e) => {
                              setReason(e.target.value);
                              setValidationErrors("");
                            }}
                          >
                            <MenuItem value="Transfer">Transfer</MenuItem>
                            <MenuItem value="Defective">Defective</MenuItem>
                            <MenuItem value="Delete">Remove Unit</MenuItem>
                          </MuiSelect>
                        </FormControl>
                        <span className="mb-2">
                          {validationErrors.action && (
                            <div className="text-red-500">
                              <ul>
                                {validationErrors.action.map((error, index) => (
                                  <li key={index}>{error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </span>
                      </Box>
                      {reason === "Transfer" && (
                        <Box style={{ marginTop: "10px" }}>
                          <Autocomplete
                            freeSolo
                            id="branch"
                            disableClearable
                            options={Branch}
                            getOptionLabel={(option) =>
                              option.name ? option.name : ""
                            }
                            readOnly={Branch.length === 0}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={
                                  Branch.length === 0
                                    ? "No branch to select"
                                    : "Assign New Branch"
                                }
                                InputProps={{
                                  ...params.InputProps,
                                  type: "search",
                                }}
                                variant="outlined"
                                style={{
                                  marginTop: "10px",
                                  marginBottom: "10px",
                                  marginRight: "400px",
                                }}
                                sx={{ minWidth: 120 }}
                              />
                            )}
                            value={
                              Branch.find(
                                (option) => option.id === branchUnit.branch
                              ) || {}
                            }
                            onChange={(event, newValue) => {
                              setBranchUnit({
                                ...branchUnit,
                                branch: newValue.id,
                              });
                            }}
                          />
                          <span className="mb-2">
                            {validationErrors.branch && (
                              <div className="text-red-500">
                                <ul>
                                  {validationErrors.branch.map(
                                    (error, index) => (
                                      <li key={index}>{error}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </span>
                          <Autocomplete
                            freeSolo
                            id="department"
                            disableClearable
                            options={Department}
                            getOptionLabel={(option) =>
                              option.name ? option.name : ""
                            }
                            readOnly={Department.length === 0}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={
                                  Department.length === 0
                                    ? "Select a branch first"
                                    : "Pick Department"
                                }
                                InputProps={{
                                  ...params.InputProps,
                                  type: "search",
                                }}
                                variant="outlined"
                                style={{
                                  marginTop: "10px",
                                  marginBottom: "10px",
                                  marginRight: "400px",
                                }}
                                sx={{ minWidth: 120 }}
                              />
                            )}
                            value={
                              Department.find(
                                (option) => option.id === branchUnit.department
                              ) || {}
                            }
                            onChange={(event, newValue) => {
                              setBranchUnit({
                                ...branchUnit,
                                department: newValue.id,
                              });
                            }}
                          />
                          <span className="mb-2">
                            {validationErrors.department && (
                              <div className="text-red-500">
                                <ul>
                                  {validationErrors.department.map(
                                    (error, index) => (
                                      <li key={index}>{error}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </span>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DatePicker"]}>
                              <MuiDatePicker
                                label="Date of Transfer"
                                value={
                                  transferDate ? dayjs(transferDate) : null
                                }
                                onChange={handleDateChange}
                                format="YYYY-MM-DD"
                                slotProps={{ textField: { fullWidth: true } }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                          <span className="mb-2">
                            {validationErrors.date && (
                              <div className="text-red-500">
                                <ul>
                                  {validationErrors.date.map((error, index) => (
                                    <li key={index}>{error}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </span>
                        </Box>
                      )}
                      <Grid className="mt-5 float-end">
                        <Button
                          type="button"
                          onClick={handleClose}
                          disabled={sloading}
                          variant="contained"
                          style={{
                            backgroundColor: "#333333",
                            marginRight: "10px",
                            color: "white",
                          }}
                        >
                          CANCEL
                        </Button>
                        <Button
                          type="submit"
                          disabled={sloading}
                          variant="contained"
                          color="success"
                          style={{ backgroundColor: "#0033A0", color: "white" }}
                        >
                          {sloading ? "SAVING..." : "SAVE"}
                        </Button>
                      </Grid>
                    </Box>
                  </form>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditSet;
