import { useState, useEffect } from "react";
import smct from "../img/smct.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import bg from "../img/bg.png";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";

function InputField({ icon, text, value, onChange, errorMessage }) {
  return (
    <div className="mb-4">
      <div className="flex items-center">
        <span className="mr-2 text-gray-400">{icon}</span>
        <input
          type={text === "Password" ? "password" : "text"}
          className={`w-full h-12 px-4 rounded-md border ${
            errorMessage ? "border-red-500" : "border-gray-300"
          } focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
          placeholder={text}
          value={value}
          onChange={onChange}
        />
      </div>
      <div className="flex items-center">
        <span
          className={errorMessage ? "mr-2 text-gray-400 opacity-0" : "hidden"}
        >
          {icon}
        </span>
        {errorMessage && <span className="text-red-500">{errorMessage}</span>}
      </div>
    </div>
  );
}

function LoginForm({ fields }) {
  const [inputValues, setInputValues] = useState(fields.map(() => ""));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const { login, setIsRefresh } = useAuth();

  // Handler for input change
  const handleChange = (index, event) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username_or_email = inputValues[0];
    const password = inputValues[1];
    setLoading(true);
    setIsRefresh(true);

    try {
      const response = await api.post("/login", {
        username_or_email,
        password,
      });

      if (response.status === 200) {
        setSuccess("Login successful!");
        login(response.data.token);
      }
    } catch (error) {
      console.error("Error:", error);

      if (error.response.status === 409) {
        Cookies.set("token", error.response.data.token);
      } else if (error.response.status === 400) {
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

        Toast.fire({
          icon: "error",
          title: error.response.data.message,
        });
      }
    } finally {
      setLoading(false);
      setIsRefresh(false);
    }
  };

  useEffect(() => {
    document.title = "Computer Monitoring - Login";
  });
  return (
    <form className="w-full max-w-md p-4 mt-10 rounded" onSubmit={handleSubmit}>
      {fields.map((item, index) => (
        <InputField
          key={index}
          icon={item.icon}
          text={item.text}
          value={inputValues[index]}
          onChange={(event) => handleChange(index, event)}
          errorMessage={
            item.text === "Username/Email"
              ? validationErrors.username_or_email
              : validationErrors.password
          }
        />
      ))}
      {success && <div className="mb-2 text-green-500">{success}</div>}

      <div className="flex flex-col items-center justify-center">
        <div className="mb-4">
          <Link to="/forgot" className="hover:underline">
            Forgot Password?
          </Link>
        </div>
        <div>
          <button
            type="submit"
            className="w-32 h-10 mt-8 font-semibold text-white bg-blue-800 rounded-full"
            disabled={loading}
          >
            {loading ? "Logging In..." : "LOG IN"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Background() {
  return (
    <div
      className="absolute inset-0 bg-center bg-cover"
      style={{ backgroundImage: `url(${bg})`, zIndex: -1 }}
    >
      <div className="absolute inset-0 bg-white opacity-90"></div>
    </div>
  );
}

function LogIn() {
  // Define fields for the login form
  const fields = [
    { icon: <FontAwesomeIcon icon={faUser} />, text: "Username/Email" },
    { icon: <FontAwesomeIcon icon={faLock} />, text: "Password" },
  ];

  return (
    <div className="relative min-h-screen">
      <Background />
      <div className="flex flex-col items-center pt-20" style={{ zIndex: 1 }}>
        <img src={smct} alt="SMCT Logo" className="block h-32 m-0 w-72"></img>
        <h1 className="mt-5 text-xl font-bold md:text-4xl">
          COMPUTER MONITORING SYSTEM
        </h1>
        <h1 className="mt-2 text-4xl font-medium">Log In</h1>
        <LoginForm fields={fields} />
        <p className="mt-2">
          Don't have an account yet?{" "}
          <Link to="/signup" className="text-blue-800">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LogIn;

//This is the Log In Form
