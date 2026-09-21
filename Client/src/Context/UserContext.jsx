import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { server } from "../config/server.js";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

    if (!token) {
      setUser(null);
      setIsAuth(false);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.user) {
        setUser(data.user);
        setIsAuth(true);
      } else {
        setUser(null);
        setIsAuth(false);
      }
    } catch (error) {
      console.warn("Session check failed:", error.response?.data?.message || error.message);
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }, []);

  async function loginUser(email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, {
        email: email.trim(),
        password,
      });

      toast.success(data.message || "Logged in successfully");
      localStorage.setItem("token", data.token);
      if (data.user.role === "admin") {
        localStorage.setItem("adminToken", data.token);
      }

      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);

      if (navigate) {
        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (data.user.role === "instructor") {
          navigate("/instructor/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      setBtnLoading(false);
      setIsAuth(false);
      const message =
        error.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(message);
    }
  }

  async function registerUser(name, email, password, role, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      toast.success(data.message || "Account registered successfully!");
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);

      if (navigate) {
        if (data.user.role === "instructor") {
          navigate("/instructor/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      setBtnLoading(false);
      const message =
        error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    }
  }

  async function updateProfile(name) {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    if (!token) return false;

    setBtnLoading(true);
    try {
      const { data } = await axios.put(
        `${server}/api/user/profile`,
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(data.user);
      toast.success(data.message || "Profile updated successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      return false;
    } finally {
      setBtnLoading(false);
    }
  }

  async function changePassword(currentPassword, newPassword) {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    if (!token) return false;

    setBtnLoading(true);
    try {
      const { data } = await axios.put(
        `${server}/api/user/password`,
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(data.message || "Password changed successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
      return false;
    } finally {
      setBtnLoading(false);
    }
  }

  function logoutUser(navigate) {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    setUser(null);
    setIsAuth(false);
    toast.success("Logged Out Successfully");
    if (navigate) navigate("/login");
  }

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const isStudent = isAuth && user?.role === "student";
  const isInstructor = isAuth && user?.role === "instructor";
  const isAdmin = isAuth && user?.role === "admin";

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        isStudent,
        isInstructor,
        isAdmin,
        loginUser,
        registerUser,
        logoutUser,
        updateProfile,
        changePassword,
        fetchUser,
        btnLoading,
        loading,
      }}
    >
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#171c28",
            color: "#f8fafc",
            border: "1px solid rgba(250, 204, 21, 0.2)",
            borderRadius: "10px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#facc15",
              secondary: "#0c0f17",
            },
          },
        }}
      />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
