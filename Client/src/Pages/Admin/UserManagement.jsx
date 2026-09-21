import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Users, Search, Trash2, Shield, UserCheck, GraduationCap, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { server } from "../../config/server.js";
import DashboardLayout from "../../Components/Layout/DashboardLayout";
import Badge from "../../Components/UI/Badge";
import SkeletonLoader from "../../Components/UI/SkeletonLoader";
import EmptyState from "../../Components/UI/EmptyState";

function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/admin/users`, authHeader);
      setUsers(data.users || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { data } = await axios.put(
        `${server}/api/admin/user/${userId}/role`,
        { role: newRole },
        authHeader
      );
      toast.success(data.message || "User role updated");
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user account?")) return;

    try {
      const { data } = await axios.delete(
        `${server}/api/admin/user/${userId}`,
        authHeader
      );
      toast.success(data.message || "User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query);
      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, searchTerm]);

  return (
    <DashboardLayout title="User & Role Management">
      <div className="student-dashboard-page animate-fade-in">
        <button
          className="btn-secondary btn-sm"
          onClick={() => navigate("/admin/dashboard")}
          style={{ width: "fit-content", gap: "6px" }}
        >
          <ArrowLeft size={16} />
          <span>Back to Console</span>
        </button>

        <div className="dashboard-section-header">
          <div>
            <h2>Platform Users ({users.length})</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Inspect registered accounts, manage roles (Student, Instructor, Admin), and enforce security.
            </p>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <div className="search-input-wrap" style={{ flex: 1, minWidth: "260px" }}>
              <Search size={18} />
              <input
                className="form-input"
                placeholder="Search user by name or email address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ minWidth: "160px" }}>
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="instructor">Instructors</option>
                <option value="admin">Administrators</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <SkeletonLoader count={4} height="60px" />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users match search"
            description="Try changing your search query or role filter."
            actionLabel="Reset Search"
            onAction={() => {
              setSearchTerm("");
              setRoleFilter("all");
            }}
          />
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Current Role</th>
                  <th>Enrolled Tracks</th>
                  <th>Joined Date</th>
                  <th>Modify Role</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const roleVariant =
                    u.role === "admin"
                      ? "gold"
                      : u.role === "instructor"
                      ? "info"
                      : "neutral";

                  const joinDate = u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "N/A";

                  return (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: "var(--surface-elevated)",
                              border: "1px solid var(--surface-border-gold)",
                              color: "var(--gold-primary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                            }}
                          >
                            {u.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                              {u.name}
                            </div>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                              {u.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <Badge variant={roleVariant}>{u.role}</Badge>
                      </td>

                      <td>
                        <strong>{u.subscription?.length || 0}</strong> courses
                      </td>

                      <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                        {joinDate}
                      </td>

                      <td>
                        <select
                          className="form-select"
                          style={{ padding: "4px 10px", fontSize: "0.82rem", width: "130px" }}
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        >
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      <td style={{ textAlign: "right" }}>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="btn-icon"
                          style={{ width: "32px", height: "32px", color: "var(--status-danger)" }}
                          title="Delete User"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default UserManagement;

