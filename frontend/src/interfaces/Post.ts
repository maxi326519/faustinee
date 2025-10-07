export interface Post {
  id?: string;
  title: string;
  slug: string;
  category: string;
  contentHtml: string;
  coverUrl: string;
  tags: string;
  state: PostState;
  reads: number;
  author: string;
  date: Date | string;
  fixedHome: boolean;
  fixedCategory: boolean;
}

export enum PostState {
  BORRADOR = "Borrador",
  PUBLICADO = "Publicado",
  OCULTO = "Oculto"
}

export const initPost = (): Post => ({
  title: "",
  slug: "",
  category: "",
  contentHtml: "",
  coverUrl: "",
  tags: "",
  state: PostState.BORRADOR,
  reads: 0,
  author: "",
  date: new Date(),
  fixedHome: false,
  fixedCategory: false,
});
