import { createContext, useContext } from "react";
import axios from "axios";
import { server } from "../config/server.js";
import toast from "react-hot-toast";
import { UserData } from "./UserContext.jsx";

const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const { user, isAuth, isAdmin, setUser, setIsAuth, btnLoading, loading, fetchUser } = UserData();

  const loginAdmin = async (email, password, navigate) => {
    try {
      const { data } = await axios.post(`${server}/api/admin/login`, {
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("adminToken", data.token);
      setUser(data.user);
      setIsAuth(true);

      toast.success(data.message || "Admin logged in successfully");
      if (navigate) navigate("/admin/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || "Admin login failed";
      toast.error(message);
    }
  };

  const logoutAdmin = (navigate) => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    setUser(null);
    setIsAuth(false);
    toast.success("Admin Logged Out");
    if (navigate) navigate("/admin/login");
  };

  return (
    <AdminContext.Provider
      value={{
        admin: isAdmin ? user : null,
        adminAuth: isAdmin,
        btnLoading,
        loading,
        loginAdmin,
        logoutAdmin,
        fetchAdmin: fetchUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const AdminData = () => useContext(AdminContext);
