import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRequiredChangePassword, setIsRequiredChangePassword] =
    useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }
      if (isLogin) {
        setLoading(true);
      }
      try {
        const response = await api.get("/profile");

        const data = response.data.data;

        if (response.status === 200) {
          setUser(data);
          setIsAuthenticated(true);

          if (data.role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }

          if (data.request_new_password === 1) {
            setIsRequiredChangePassword(true);
          } else {
            setIsRequiredChangePassword(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        if (error.response && error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Session Expired",
            confirmButtonColor: "#1e88e5",
            showCloseButton: true,
            confirmButtonText: "Go to login page",
            html: "Session Expired, You will be redirected to the Login page <br>Thank you!",
          }).then(() => {
            logout();
            setIsAuthenticated(false);
          });
        }
      } finally {
        setLoading(false);
        setIsLogin(false);
      }
    };
    fetchUserProfile();
  }, [isRefresh, isLogin]);

  const login = (token) => {
    Cookies.set("token", token);
    setIsLogin(true);
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
  };

  const updateProfileData = async (formData) => {
    try {
      const response = await api.post("/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
        setUser(response.data.data);
        setErrors({});
      }
    } catch (error) {
      console.error("Failed to update profile data", error);
      setErrors(error.response.data.errors);
      if (error.response && error.response.data) {
        console.error("Backend error response:", error.response.data);
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
    }
  };
  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        isRequiredChangePassword,
        setIsRefresh,
        updateProfileData,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
