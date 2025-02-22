import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";

const Notfound = () => {
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    document.title = "Computer Monitoring - Not Found";
  });
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="mb-4 font-bold text-gray-600">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-9xl" />
        </p>
        <h1 className="mb-4 text-6xl font-bold text-gray-800">404 Not Found</h1>
        <p className="m-3 text-lg text-gray-600">
          Sorry, the page you are looking for does not exist.
        </p>
        <p className="mb-3">
          You can optionally add a link to go back to home or another page
        </p>
        {isAuthenticated ? (
          <p className="mt-5">
            <Link
              to="/dashboard"
              className="px-4 py-2 font-bold text-white transition duration-300 ease-in-out bg-blue-500 rounded-lg shadow-md hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> &nbsp; Go back to Dashboard
            </Link>
          </p>
        ) : (
          <p className="mt-5">
            <Link
              to="/login"
              className="px-4 py-2 font-bold text-white transition duration-300 ease-in-out bg-blue-500 rounded-lg shadow-md hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> &nbsp; Go back to Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Notfound;
