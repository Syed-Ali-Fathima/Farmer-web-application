/**
 * AuthContext.jsx
 * Global authentication state management using React Context
 */
import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

// Mock user database (in production this would be a real API)
const mockUsers = [
  {
    id: 1, name: "Demo Farmer", email: "farmer@kisanseva.in",
    phone: "9876543210", password: "farmer123",
    village: "Rohtak, Haryana", role: "farmer",
    avatar: "DF", joinDate: "2025-01-15",
  },
  {
    id: 2, name: "Admin User", email: "admin@kisanseva.in",
    phone: "9000000001", password: "admin123",
    village: "New Delhi", role: "admin",
    avatar: "AU", joinDate: "2024-06-01",
  },
];

let nextId = 100;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("kisan_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("kisan_users");
      return saved ? JSON.parse(saved) : [...mockUsers];
    } catch { return [...mockUsers]; }
  });

  const login = useCallback((emailOrPhone, password) => {
    const found = registeredUsers.find(
      (u) => (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password
    );
    if (!found) return { success: false, error: "Invalid credentials. Please try again." };
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem("kisan_user", JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  }, [registeredUsers]);

  const register = useCallback((data) => {
    const exists = registeredUsers.find(
      (u) => u.email === data.email || u.phone === data.phone
    );
    if (exists) return { success: false, error: "Account with this email/phone already exists." };

    const newUser = {
      id: ++nextId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      village: data.village || "",
      role: "farmer",
      avatar: data.name.slice(0, 2).toUpperCase(),
      joinDate: new Date().toISOString().split("T")[0],
    };
    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    localStorage.setItem("kisan_users", JSON.stringify(updated));

    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem("kisan_user", JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  }, [registeredUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("kisan_user");
  }, []);

  const updateProfile = useCallback((updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("kisan_user", JSON.stringify(updated));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
