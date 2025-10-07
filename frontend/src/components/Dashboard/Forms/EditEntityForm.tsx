import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface FieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: { value: any; label: string }[];
}

interface Props<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entity: T) => void;
  fields: FieldConfig[];
  initialData: T;
  title: string;
}

export default function EditEntityForm<T extends object>({
  isOpen,
  onClose,
  onSubmit,
  fields,
  initialData,
  title,
}: Props<T>) {
  const [formData, setFormData] = useState<T>(initialData);

  // Actualizar el estado del formulario cuando cambia `initialData`
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Manejar cambios en los campos de entrada
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar cambios en los campos de selección
  const handleSelectChange = (name: string, value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value === "null" ? null : value, // Convertir "null" a null
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Si el campo "password" está vacío, eliminarlo antes de enviar
    if ("password" in formData && formData.password === "") {
      const { password, ...updatedData } = formData as any;
      onSubmit(updatedData);
    } else {
      onSubmit(formData);
    }

    onClose();
  };

  // Formatear fechas al formato YYYY-MM-DD
  useEffect(() => {
    const formattedData = { ...initialData };

    fields.forEach((field) => {
      if (field.type === "date" && (formattedData as any)[field.name]) {
        const dateValue = new Date((formattedData as any)[field.name]);
        if (!isNaN(dateValue.getTime())) {
          (formattedData as any)[field.name] = dateValue
            .toISOString()
            .split("T")[0];
        }
      }
    });

    setFormData(formattedData);
  }, [initialData, fields]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={(formData as any)[field.name] || "null"} // Usar "null" como valor predeterminado
                  onChange={(e) =>
                    handleSelectChange(
                      field.name,
                      e.target.value === "null" ? null : e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-950 dark:text-gray-100 dark:border-gray-900"
                >
                  {field.options?.map((option) => (
                    <option
                      key={option.value}
                      value={option.value === null ? "null" : option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar cambios</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
