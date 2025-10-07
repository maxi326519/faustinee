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
import { useUsers } from "@/hooks/useUser";
import useUserStore from "@/stores/sesionStore";
import Swal from "sweetalert2";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordModal({ isOpen, onClose }: PasswordModalProps) {
  const { changePassword } = useUsers();
  const { data: user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setError("La nueva contraseña no puede ser igual a la anterior.");
      return;
    }

    if (!user?.id) {
      setError("No se encontró el ID del usuario.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Llamada a la API para cambiar la contraseña
      await changePassword(
        user.id,
        user.email,
        formData.oldPassword,
        formData.newPassword
      );

      // Limpiar el formulario y mostrar mensaje de éxito
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      Swal.fire(
        "¡Contraseña actualizada!",
        "Tu contraseña ha sido actualizada correctamente.",
        "success"
      );
      onClose(); // Cerrar el modal
    } catch (error: any) {
      console.error("Error al actualizar la contraseña:", error);
      setError(
        error.response?.data?.message ||
          "Error al actualizar la contraseña. Inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Deshabilitar el botón si el formulario no está completo o hay un error
  const isFormValid =
    formData.oldPassword &&
    formData.newPassword &&
    formData.confirmPassword &&
    !error;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Cambiar Contraseña</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="oldPassword">Contraseña actual</Label>
            <Input
              id="oldPassword"
              name="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Ingrese su contraseña actual"
              required
            />
          </div>
          <div>
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Ingrese la nueva contraseña"
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirme la nueva contraseña"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button type="submit" disabled={!isFormValid || isLoading}>
              {isLoading ? "Actualizando..." : "Confirmar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
