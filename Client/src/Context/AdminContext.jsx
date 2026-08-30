import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../config/server.js";
import toast from "react-hot-toast";

const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [adminAuth, setAdminAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const loginAdmin = async (email, password, navigate) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/admin/login`, {
        email,
        password,
      });

      localStorage.setItem("adminToken", data.token);
      setAdmin(data.user);
      setAdminAuth(true);

      toast.success(data.message || "Admin logged in successfully");
      navigate("/admin/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || "Admin login failed";
      toast.error(message);
    } finally {
      setBtnLoading(false);
    }
  };

  const logoutAdmin = (navigate) => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
    setAdminAuth(false);
    toast.success("Logged Out Successfully");
    if (navigate) navigate("/admin/login");
  };

  // Restore the admin session on refresh, same pattern as the student/instructor fetchUser
  async function fetchAdmin() {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.user?.role === "admin") {
        setAdmin(data.user);
        setAdminAuth(true);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdmin();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        admin,
        adminAuth,
        btnLoading,
        loading,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const AdminData = () => useContext(AdminContext);
