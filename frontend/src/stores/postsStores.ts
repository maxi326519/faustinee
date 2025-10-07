import { initPage, Page } from "@/interfaces/Page";
import { produce } from "immer";
import { create } from "zustand";
import { Post } from "@/interfaces/Post";

export interface CategorySection {
  category1: Post[];
  category2: Post[];
  category3: Post[];
}

export interface ByCategory {
  page: Page;
  category: string;
  data: Post[];
}

const categorySection: CategorySection = {
  category1: [],
  category2: [],
  category3: [],
};

const byCategory: ByCategory = {
  page: initPage(),
  category: "",
  data: [],
};

type PostState = {
  // Blog
  latest: Post[];
  mustReads: Post[];
  categorySection: CategorySection;
  byCategory: ByCategory;
  setLatest: (latest: Post[]) => void;
  setMustReads: (mustReads: Post[]) => void;
  setCategorySection: (categorySection: CategorySection) => void;
  setByCategory: (byCategory: ByCategory) => void;

  // Dashboard
  data: Post[];
  page: Page;
  set: (posts: Post[], page: Page) => void;
  add: (post: Post) => void;
  update: (post: Post) => void;
  delete: (postId: string) => void;
  clear: () => void;
};

const usePostStore = create<PostState>()((set) => ({
  // Blog
  latest: [],
  mustReads: [],
  categorySection,
  byCategory,
  setLatest: (latest) => set(() => ({ latest })),
  setMustReads: (mustReads) => set(() => ({ mustReads })),
  setCategorySection: (categorySection) => set(() => ({ categorySection })),
  setByCategory: (byCategory) => set(() => ({ byCategory })),

  // Dashboard
  data: [],
  page: initPage(),
  set: (posts, page) => set(() => ({ data: posts, page })),
  add: (post) =>
    set(
      produce((state) => {
        state.data.push(post);
      })
    ),
  update: (post) =>
    set(
      produce((state) => {
        const index = state.data.findIndex((p: Post) => p.id === post.id);
        if (index !== -1) state.data[index] = post;
      })
    ),
  delete: (postId) =>
    set(
      produce((state) => {
        state.data = state.data.filter((p: Post) => p.id !== postId);
      })
    ),
  clear: () => set(() => ({ data: [], page: initPage() })),
}));

export default usePostStore;
