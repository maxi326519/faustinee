export interface Cover {
  id: string;
  title: string;
  imageUrl: string;
  state: "Publicado" | "Oculto";
  pinned: boolean;
  created_at: string;
}
