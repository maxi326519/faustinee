import { X, Upload, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

import Modal from "@/components/Modal";

interface CoverFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    image: File | null;
  }) => void;
  initialData?: {
    title: string;
    image: File | null;
  };
}

export default function CoverForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CoverFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    image: initialData?.image || null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, image: null }));
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      title: "",
      image: null,
    });
    setImagePreview(null);
    onClose();
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Modal visible={isOpen} title="Subir Cover" onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            type="text"
            placeholder="Título del cover"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Imagen</label>

          {/* Input de archivo oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
            aria-label="Seleccionar imagen"
          />

          {/* Botón para seleccionar imagen */}
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-20 border-dashed border-2 border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center gap-2"
          >
            <Upload className="h-6 w-6 text-gray-400" />
            <span className="text-sm text-gray-500">
              {formData.image ? "Cambiar imagen" : "Seleccionar imagen"}
            </span>
          </Button>

          {/* Preview de la imagen */}
          {imagePreview && (
            <div className="mt-3 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-32 object-cover rounded-md border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Información del archivo seleccionado */}
          {formData.image && (
            <div className="mt-2 p-2 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ImageIcon className="h-4 w-4" />
                <span className="truncate">{formData.image.name}</span>
                <span className="text-xs text-gray-400">
                  ({(formData.image.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            Subir Cover
          </Button>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
