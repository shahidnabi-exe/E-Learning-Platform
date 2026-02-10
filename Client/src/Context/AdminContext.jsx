import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [adminAuth, setAdminAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // 🔐 Fixed admin credentials
  const ADMIN_EMAIL = "ahmed@gmail.com";
  const ADMIN_PASSWORD = "112233";

  const loginAdmin = async (email, password, navigate) => {
    setBtnLoading(true);

    try {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminData = {
          name: "Admin",
          email,
          role: "admin",
        };

        localStorage.setItem("admin", JSON.stringify(adminData));
        setAdmin(adminData);
        setAdminAuth(true);

        toast.success("Admin logged in successfully");
        navigate("/admin/dashboard");
      } else {
        toast.error("Invalid admin credentials");
      }
    } catch (error) {
      toast.error("Admin login failed");
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const logoutAdmin = (navigate) => {
    localStorage.removeItem("admin");
    setAdmin(null);
    setAdminAuth(false);
    navigate("/login");
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        adminAuth,
        btnLoading,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const AdminData = () => useContext(AdminContext);
