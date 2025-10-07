import { create } from "zustand";
import {
  CMSContent,
  ContainerContent,
  ContentType,
  FlexContent,
} from "@/interfaces/types";

import { useEffect } from "react";

interface UseCMRStore {
  contents: CMSContent[];
  selected: string;
  setContents: (content: CMSContent, parentId?: string) => void;
  updateContents: (content: CMSContent) => void;
  deleteContent: (contentId: string) => void;
  setSelected: (selected: string) => void;
  clear: () => void;
}

interface UseCMS {
  data: CMSContent[];
  selected: string;
  add: (type: ContentType, parentId?: string) => void;
  getById: (contentId: string) => CMSContent | undefined;
  getFirst: () => CMSContent | undefined;
  update: (content: CMSContent) => void;
  remove: (contentId: string) => void;
  select: (contentId: string) => void;
  clear: () => void;
}

const firstContent: FlexContent = {
  id: "0",
  type: "flex",
  direction: "column",
  children: [],
  styles: {},
};

const useCMSStore = create<UseCMRStore>((set) => ({
  contents: [firstContent],
  selected: "",
  setContents: (content: CMSContent, parentId?: string) =>
    set((state) => ({
      contents: [
        ...(parentId
          ? state.contents.map((node) =>
              node.id === parentId
                ? {
                    ...node,
                    children: [
                      ...(node as ContainerContent).children,
                      content.id,
                    ],
                  }
                : node
            )
          : state.contents),
        content,
      ],
    })),
  updateContents: (content: CMSContent) =>
    set((state) => ({
      contents: state.contents.map((node) =>
        node.id === content.id ? content : node
      ),
    })),
  deleteContent: (contentId: string) =>
    set((state) => ({
      contents: state.contents.filter((node) => node.id !== contentId),
    })),
  setSelected: (selected: string) => set({ selected }),
  clear: () =>
    set({
      contents: [firstContent],
      selected: "",
    }),
}));

export default function useCMS(): UseCMS {
  const {
    contents,
    selected,
    setContents,
    updateContents,
    deleteContent,
    setSelected,
    clear,
  } = useCMSStore();

  useEffect(() => {
    console.log("Nodes", contents);
  }, [contents]);

  useEffect(() => {
    console.log("Selected", selected);
  }, [selected]);

  function addContent(type: ContentType, parentId?: string) {
    let newContent: CMSContent | null = null;

    switch (type) {
      case "text":
        newContent = {
          id: Date.now().toString(),
          type: "text",
          value: "",
          styles: {},
        };
        break;
      case "image":
        newContent = {
          id: Date.now().toString(),
          type: "image",
          url: "",
          styles: {},
        };
        break;
      case "grid":
        newContent = {
          id: Date.now().toString(),
          type: "grid",
          rows: 2,
          cols: 2,
          children: [],
          styles: {},
        };
        break;
      case "flex":
        newContent = {
          id: Date.now().toString(),
          type: "flex",
          direction: "row",
          children: [],
          styles: {},
        };
        break;
      default:
        return;
    }
    if (newContent) setContents(newContent, parentId);
  }

  function getComponentById(contentId: string): CMSContent | undefined {
    return contents.find((content) => content.id === contentId);
  }

  function updateContent(content: CMSContent) {
    console.log("New update", content);
    updateContents(content);
  }

  function removeContent(contentId: string) {
    deleteContent(contentId);
  }

  function selectedContent(contentId: string) {
    setSelected(contentId);
  }

  return {
    data: contents,
    selected,
    add: addContent,
    getById: getComponentById,
    getFirst: () => getComponentById("0"),
    update: updateContent,
    remove: removeContent,
    select: selectedContent,
    clear,
  };
}
