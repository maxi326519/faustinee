import { create } from "zustand";
import { User } from "@/interfaces/User";

type SesionStore = {
  data: User | null;
  set: (user: User) => void;
  clear: () => void;
};

const useSesionStore = create<SesionStore>()((set) => ({
  data: null,
  set: (user: User) => set(() => ({ data: user })),
  clear: () => set(() => ({ data: null })),
}));

export default useSesionStore;
