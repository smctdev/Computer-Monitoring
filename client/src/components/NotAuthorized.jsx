import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const NotAuthorized = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-white z-[100] overflow-hidden">
      <div className="w-full max-w-xl p-8 text-center bg-white rounded-lg">
        <p className="mb-4 font-bold text-gray-600">
          <FontAwesomeIcon icon={faBan} className="text-9xl" />
        </p>
        <h1 className="mb-4 text-6xl font-extrabold text-red-600">
          403 - Forbidden
        </h1>
        <p className="mb-6 text-xl text-gray-700">
          You do not have permission to view this page.
        </p>
        <p className="mb-4 text-gray-500 text-md">
          If you believe this is a mistake, please contact support.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-6 py-3 mt-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Go Back Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotAuthorized;
