import { create } from "zustand";

interface LoadingState {
  state: boolean;
  message: string;
  setLoading: (loading: boolean) => void;
  open: (message?: string) => void;
  setMessage: (message: string) => void,
  close: () => void;
}

const useLoading = create<LoadingState>((set) => ({
  state: false,
  message: "",
  setLoading: (loading: boolean) => set({ state: loading }),
  open: (message?: string) => set({ state: true, message }),
  setMessage: (message: string) => set({ message }),
  close: () => set({ state: false, message: "" }),
}));

export default useLoading;
