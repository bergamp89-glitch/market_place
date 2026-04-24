import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const USERS_STORAGE_KEY = "tealmarket_users_v3";
const CURRENT_USER_STORAGE_KEY = "tealmarket_current_user_v3";

const seedUsers = [
  {
    id: 1,
    name: "Admin User",
    phone: "998900000001",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    name: "Seller User",
    phone: "998900000002",
    password: "seller123",
    role: "seller",
  },
  {
    id: 3,
    name: "Demo User",
    phone: "998900000003",
    password: "user123",
    role: "user",
  },
];

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function readUsers() {
  try {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (!saved) return seedUsers;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedUsers;
  } catch {
    return seedUsers;
  }
}

function readCurrentUser() {
  try {
    const saved = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => readUsers());
  const [currentUser, setCurrentUser] = useState(() => readCurrentUser());

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch {
      //
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    } catch {
      //
    }
  }, [currentUser]);

  const isAuthenticated = Boolean(currentUser);

  const register = (payload) => {
    const name = String(payload?.name || "").trim();
    const phone = normalizePhone(payload?.phone);
    const password = String(payload?.password || "").trim();
    const role = payload?.role || "user";

    if (!name) {
      return { success: false, error: "Ism kiritilishi shart." };
    }

    if (!phone) {
      return { success: false, error: "Telefon raqam kiritilishi shart." };
    }

    if (!password) {
      return { success: false, error: "Parol kiritilishi shart." };
    }

    const phoneExists = users.some((user) => normalizePhone(user.phone) === phone);

    if (phoneExists) {
      return { success: false, error: "Bu telefon raqam allaqachon ro‘yxatdan o‘tgan." };
    }

    const newUser = {
      id: Date.now(),
      name,
      phone,
      password,
      role,
    };

    const updatedUsers = [newUser, ...users];
    setUsers(updatedUsers);
    setCurrentUser(newUser);

    return { success: true, user: newUser };
  };

  const registerUser = (payload) => register(payload);

  const login = (phoneOrPayload, maybePassword) => {
    const phone =
      typeof phoneOrPayload === "object"
        ? normalizePhone(phoneOrPayload?.phone)
        : normalizePhone(phoneOrPayload);

    const password =
      typeof phoneOrPayload === "object"
        ? String(phoneOrPayload?.password || "").trim()
        : String(maybePassword || "").trim();

    if (!phone) {
      return { success: false, error: "Telefon raqam kiritilishi shart." };
    }

    if (!password) {
      return { success: false, error: "Parol kiritilishi shart." };
    }

    const foundUser = users.find(
      (user) =>
        normalizePhone(user.phone) === phone && String(user.password) === password
    );

    if (!foundUser) {
      return { success: false, error: "Telefon raqam yoki parol noto‘g‘ri." };
    }

    setCurrentUser(foundUser);
    return { success: true, user: foundUser };
  };

  const loginWithPhone = (payload) => login(payload);

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updates) => {
    if (!currentUser) {
      return { success: false, error: "Foydalanuvchi topilmadi." };
    }

    const nextName =
      updates?.name !== undefined ? String(updates.name).trim() : currentUser.name;

    const nextPhone =
      updates?.phone !== undefined
        ? normalizePhone(updates.phone)
        : normalizePhone(currentUser.phone);

    const nextPassword =
      updates?.password !== undefined
        ? String(updates.password).trim()
        : currentUser.password;

    if (!nextName) {
      return { success: false, error: "Ism bo‘sh bo‘lmasligi kerak." };
    }

    if (!nextPhone) {
      return { success: false, error: "Telefon raqam bo‘sh bo‘lmasligi kerak." };
    }

    const duplicatePhone = users.some(
      (user) =>
        user.id !== currentUser.id && normalizePhone(user.phone) === nextPhone
    );

    if (duplicatePhone) {
      return { success: false, error: "Bu telefon raqam boshqa foydalanuvchida bor." };
    }

    const updatedUser = {
      ...currentUser,
      name: nextName,
      phone: nextPhone,
      password: nextPassword,
    };

    setUsers((prev) =>
      prev.map((user) => (user.id === currentUser.id ? updatedUser : user))
    );
    setCurrentUser(updatedUser);

    return { success: true, user: updatedUser };
  };

  const value = useMemo(
    () => ({
      users,
      currentUser,
      isAuthenticated,
      login,
      loginWithPhone,
      register,
      registerUser,
      logout,
      updateProfile,
    }),
    [users, currentUser, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}