import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import StorageUtils from "../utils/StorageUtils";
import { useAuth } from "../context/AuthContext";

const SearchableDropdown = ({ options, placeholder, onSelect, userData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const handleInputChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filteredOptions);
    setIsOpen(true);
    if (!searchTerm) {
      onSelect("");
    }
  };

  const handleInputFocus = () => {
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filteredOptions);
    setIsOpen(true);
  };

  const handleSelectOption = (option) => {
    setSearchTerm(option.label);
    onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    if (userData?.branch_code.branch_name) {
      setSearchTerm(userData?.branch_code.branch_name);
    }
  }, [userData]);

  return (
    <div ref={dropdownRef} className="relative flex items-center mt-4">
      <input
        type="text"
        className="w-full h-12 px-4 border border-gray-300 rounded-md"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
      {isOpen && (
        <ul className="absolute z-20 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md top-full max-h-60">
          {Array.isArray(filteredOptions) && filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectOption(option)}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500 cursor-default">
              No branches found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

function Placeholder() {
  const [loading, setLoading] = useState(false);
  const [inputValues, setInputValues] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    branch_code_id: "",
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    newPassword_confirmation: "",
    profile_picture: null,
  });
  const [preview, setPreview] = useState(null);
  const [branches, setBranches] = useState({ branches: [] });
  const { user, updateProfileData, errors } = useAuth();

  useEffect(() => {
    setInputValues({
      firstName: user.firstName,
      lastName: user.lastName,
      contactNumber: user.contactNumber,
      branch_code_id: user.branch_code.id,
      username: user.username,
      email: user.email,
      profile_picture: user.profile_picture,
      oldPassword: "",
      newPassword: "",
      newPassword_confirmation: "",
    });
  }, [user]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await api.get("/branch-code");
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  const options = branches.branches.map((branch) => ({
    label: branch.branch_name,
    value: branch.id,
  }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInputValues({ ...inputValues, profile_picture: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", inputValues.firstName);
      formData.append("lastName", inputValues.lastName);
      formData.append("contactNumber", inputValues.contactNumber);
      formData.append("branch_code_id", inputValues.branch_code_id);
      formData.append("username", inputValues.username);
      formData.append("email", inputValues.email);
      formData.append("oldPassword", inputValues.oldPassword);
      formData.append("newPassword", inputValues.newPassword);
      formData.append(
        "newPassword_confirmation",
        inputValues.newPassword_confirmation
      );
      formData.append("profile_picture", inputValues.profile_picture);
      await updateProfileData(formData);
      inputValues.oldPassword = "";
      inputValues.newPassword = "";
      inputValues.newPassword_confirmation = "";
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-2xl p-4 mt-10 rounded">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex flex-col items-center justify-center w-full mt-4">
          <div className="flex flex-col items-center justify-center p-4 border shadow-xl w-80 h-80 rounded-xl">
            <LazyLoadImage
              src={
                preview ? preview : StorageUtils(inputValues.profile_picture)
              }
              alt="Profile"
              effect="blur"
              className="w-48 h-48 rounded-full"
            />
            <label htmlFor="upload-button" className="folder">
              <p className="font-normal text-center text-gray-600 bg-gray-100 cursor-pointer hover:bg-gray-300">
                Change Photo
                <FontAwesomeIcon icon={faCamera} className="pl-2" />
              </p>
            </label>
            <input
              id="upload-button"
              type="file"
              name="profile_picture"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="pt-2 text-lg font-semibold text-center">
              {user ? (
                <>
                  {`${user.firstName} ${user.lastName}`}
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="pl-2 text-blue-500"
                  />
                </>
              ) : (
                ""
              )}
            </p>
          </div>
        </div>
        <p className="mt-5 mb-5 text-xl text-center">Profile Information</p>
        <hr />
        <div className="flex items-center mt-5">
          <div className="w-1/2 pr-2">
            <input
              type="text"
              className="w-full h-12 px-4 mr-2 border border-gray-300 rounded-md"
              placeholder="First Name"
              value={inputValues.firstName}
              onChange={(e) =>
                setInputValues({ ...inputValues, firstName: e.target.value })
              }
            />
            <span className="mb-2">
              {errors.firstName && (
                <div className="text-red-500">
                  <ul>
                    {errors.firstName.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </span>
          </div>
          <div className="w-1/2 pr-2">
            <input
              type="text"
              className="w-full h-12 px-4 ml-2 border border-gray-300 rounded-md"
              placeholder="Last Name"
              value={inputValues.lastName}
              onChange={(e) =>
                setInputValues({ ...inputValues, lastName: e.target.value })
              }
            />
            <span className="mb-2">
              {errors.lastName && (
                <div className="text-red-500">
                  <ul>
                    {errors.lastName.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/2 pr-2">
            <input
              type="text"
              className="w-full h-12 px-4 mr-2 border border-gray-300 rounded-md"
              placeholder="Contact Number"
              value={inputValues.contactNumber}
              onChange={(e) =>
                setInputValues({
                  ...inputValues,
                  contactNumber: e.target.value,
                })
              }
            />
            <span className="mb-2">
              {errors.contactNumber && (
                <div className="text-red-500">
                  <ul>
                    {errors.contactNumber.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </span>
          </div>
          <div className="w-1/2 pr-2">
            <input
              type="email"
              className="w-full h-12 px-4 ml-2 border border-gray-300 rounded-md"
              placeholder="Email"
              value={inputValues.email}
              onChange={(e) =>
                setInputValues({ ...inputValues, email: e.target.value })
              }
            />
            <span className="mb-2">
              {errors.email && (
                <div className="text-red-500">
                  <ul>
                    {errors.email.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </span>
          </div>
        </div>
        <SearchableDropdown
          userData={user}
          options={options}
          name="branch_code_id"
          id="branch_code_id"
          placeholder="Select Branch Code"
          onSelect={(option) =>
            setInputValues({ ...inputValues, branch_code_id: option.value })
          }
        />
        <span className="mb-2">
          {errors.branch_code_id && (
            <div className="text-red-500">
              <ul>
                {errors.branch_code_id.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </span>
        <div className="flex items-center mt-4">
          <input
            type="text"
            className="w-full h-12 px-4 border border-gray-300 rounded-md"
            placeholder="Username"
            value={inputValues.username}
            onChange={(e) =>
              setInputValues({ ...inputValues, username: e.target.value })
            }
          />
        </div>
        <span className="mb-2">
          {errors.username && (
            <div className="text-red-500">
              <ul>
                {errors.username.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </span>
        <p className="mt-5 mb-5 text-xl text-center">Change Password</p>
        <hr />
        <div className="flex items-center mt-5">
          <input
            type="password"
            className="w-full h-12 px-4 border border-gray-300 rounded-md"
            placeholder="Old Password"
            value={inputValues.oldPassword}
            onChange={(e) =>
              setInputValues({ ...inputValues, oldPassword: e.target.value })
            }
          />
        </div>
        <span className="mb-2">
          {errors.oldPassword && (
            <div className="text-red-500">
              <ul>
                {errors.oldPassword.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </span>
        <div className="flex items-center mt-4">
          <input
            type="password"
            className="w-full h-12 px-4 border border-gray-300 rounded-md"
            placeholder="New Password"
            value={inputValues.newPassword}
            onChange={(e) =>
              setInputValues({ ...inputValues, newPassword: e.target.value })
            }
          />
        </div>{" "}
        <span className="mb-2">
          {errors.newPassword && (
            <div className="text-red-500">
              <ul>
                {errors.newPassword.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </span>
        <div className="flex items-center mt-4">
          <input
            type="password"
            className="w-full h-12 px-4 border border-gray-300 rounded-md"
            placeholder="Confirm New Password"
            value={inputValues.newPassword_confirmation}
            onChange={(e) =>
              setInputValues({
                ...inputValues,
                newPassword_confirmation: e.target.value,
              })
            }
          />
        </div>
        <span className="mb-2">
          {errors.newPassword_confirmation && (
            <div className="text-red-500">
              <ul>
                {errors.newPassword_confirmation.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </span>
        <div className="flex items-center justify-center">
          <div className="flex gap-2 pb-10">
            <Link to="/dashboard">
              <button type="button" className="h-10 mt-10 font-semibold text-white bg-gray-600 w-44 rounded-xl">
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={
                loading
                  ? "h-10 mt-10 font-semibold text-white bg-blue-300 w-44 rounded-xl"
                  : "h-10 mt-10 font-semibold text-white bg-blue-600 w-44 rounded-xl"
              }
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const Profile = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full p-4 space-y-4">
      <Placeholder />
    </div>
  );
};

export default Profile;
