import { initUser, User, UserRol } from "@/interfaces/User";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: User) => void;
  isEdit?: boolean;
  initialData?: User;
}

export default function UserForm({ isOpen, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState<User>(initUser());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: User) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role: UserRol) => {
    setFormData((prev: User) => ({
      ...prev,
      role,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.role) {
      alert("Por favor, selecciona un role antes de continuar.");
      return;
    }

    onSubmit(formData);
    setFormData(initUser());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
        </DialogHeader>

        {/* Formulario de usuario */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingrese el nombre"
            />
          </div>

          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingrese el correo electrónico"
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="Ingrese la contraseña"
            />
          </div>

          <div>
            <Label>Rol</Label>
            <div className="flex gap-4">
              {Object.values(UserRol)
                .filter((option) => option)
                .map((role) => (
                  <Button
                    key={role}
                    variant={formData.role === role ? "default" : "secondary"}
                    onClick={() => handleRoleChange(role)}
                  >
                    {role}
                  </Button>
                ))}
            </div>
          </div>

          {/* Botones */}
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Crear</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
