import { useState } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";

export default function AddSupplierModal({ isOpen, onClose, isRefresh, modalRef }) {
  const [supplierName, setSupplierName] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    isRefresh(true);
    try {

      const response = await api.post(
        "/add-supplier",
        {
          supplier_name: supplierName,
        },
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
        setSupplierName("");
        setValidationErrors("");
        onClose();
      }
    } catch (error) {
      console.error("Error in adding supplier:", error);
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
      setLoading(false);
      isRefresh(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="w-full p-6 bg-white rounded-lg shadow-lg sm:w-96" ref={modalRef}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Add Supplier
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="supplier_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Supplier
                </label>
                <input
                  type="text"
                  id="supplier_name"
                  name="supplier_name"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter supplier"
                />
                {validationErrors.supplier_name && (
                  <span className="text-red-500">
                    {validationErrors.supplier_name[0]}
                  </span>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-black bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
