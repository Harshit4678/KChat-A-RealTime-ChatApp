import { create } from "zustand";

export const useAdminStore = create((set) => ({
  admin: null,
  setAdmin: (admin) => set({ admin }),
  logout: () => {
    localStorage.removeItem("adminToken");
    set({ admin: null });
  },
}));
