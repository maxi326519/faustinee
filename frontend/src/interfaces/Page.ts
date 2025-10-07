export interface Page {
  current: number;
  items: number;
  totalPages: number;
}

export const initPage = (): Page => ({
  current: 0,
  items: 0,
  totalPages: 0,
});
