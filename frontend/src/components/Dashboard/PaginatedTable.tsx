import DataTable from "./DataTable";
import PaginationControls from "./PaginationControls";

interface PaginatedTableProps<T> {
  data: T[];
  columns: {
    key: keyof T | string; // Permitir claves que no sean propiedades directas
    label: string;
    render?: (row: T) => React.ReactNode;
  }[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function PaginatedTable<T>({
  data,
  columns,
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}: PaginatedTableProps<T>) {
  if (loading) {
    return <div className="text-center py-4 text-gray-500">Cargando...</div>;
  }
  return (
    <>
      <DataTable
        data={data || []}
        columns={columns}
        noDataMessage="No se encontraron resultados"
      />
      {data && data.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
