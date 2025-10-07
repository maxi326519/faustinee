import { User } from "@/interfaces/User";
import { create } from "zustand";
import { produce } from "immer";

type UserState = {
  data: User[];
  set: (users: User[]) => void;
  add: (user: User) => void;
  update: (user: User) => void;
  delete: (userId: string) => void;
  clear: () => void;
};

const useUserStore = create<UserState>()((set) => ({
  data: [],
  set: (users: User[]) => set(() => ({ data: users })),
  add: (user: User) =>
    set(
      produce((state) => {
        state.data.push(user);
      })
    ),
  update: (user: User) =>
    set(
      produce((state) => {
        const index = state.data.findIndex((u: User) => u.id === user.id);
        if (index !== -1) state.data[index] = user;
      })
    ),
  delete: (userId: string) =>
    set(
      produce((state) => {
        state.data = state.data.filter((u: User) => u.id !== userId);
      })
    ),
  clear: () => set(() => ({ data: [] })),
}));

export default useUserStore;
