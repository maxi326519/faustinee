export type ContainerType = "grid" | "flex";
export type ContentType = "text" | "image" | ContainerType;
export type ContainerContent = GridContent | FlexContent;

export interface BaseContent {
  id: string;
  type: ContentType;
  styles: React.CSSProperties;
}

export interface TextContent extends BaseContent {
  type: "text";
  value: string;
}

export interface ImageContent extends BaseContent {
  type: "image";
  url: string;
}

export interface GridContent extends BaseContent {
  type: "grid";
  rows: number;
  cols: number;
  children: string[]; // IDs
}

export interface FlexContent extends BaseContent {
  type: "flex";
  direction: "row" | "column" | "row-reverse" | "column-reverse";
  children: string[]; // IDs
}

export type CMSContent = ContainerContent | TextContent | ImageContent;

export interface CMSContainer {
  id: string;
  containerType: ContainerType;
  rootId: string; // ID del componente raíz
  components: CMSContent[]; // todos los componentes planos
}