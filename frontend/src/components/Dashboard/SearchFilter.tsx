import { UserRol } from "@/interfaces/User";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFilterProps {
  search: string;
  setSearch: (value: string) => void;
  roleFilter?: "all" | UserRol;
  setRoleFilter?: (value: "all" | UserRol) => void;
  placeholder?: string;
}

export default function SearchFilter({
  search,
  placeholder,
  roleFilter,
  setSearch,
  setRoleFilter,
}: SearchFilterProps) {
  return (
    <div className="flex gap-4">
      <Input
        placeholder={placeholder || "Buscar..."}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full "
      />

      {roleFilter && setRoleFilter && (
        <Select
          value={roleFilter}
          onValueChange={(value) =>
            setRoleFilter && setRoleFilter(value as UserRol | "all")
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filtrar por role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value={UserRol.Admin}>Admin</SelectItem>
            <SelectItem value={UserRol.Asistente}>Asistente</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
