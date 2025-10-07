import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T | string; // Permitir claves que no sean propiedades directas
    label: string;
    render?: (row: T) => React.ReactNode;
  }[];
  noDataMessage?: string;
}

export default function DataTable<T>({
  data,
  columns,
  noDataMessage = "No se encontraron datos",
}: DataTableProps<T>) {
  if (!data) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        {noDataMessage}
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key as string} className="w-[200px]">
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col.key as string} className="w-[200px]">
                  {col.render
                    ? col.render(row)
                    : (row[col.key as keyof T] as React.ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="text-center py-4 text-gray-500"
            >
              {noDataMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
