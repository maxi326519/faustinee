import { useState } from "react";
import Swal from "sweetalert2";

interface Props {
  fileUrl: string;
  setFile: (file: File | null) => void;
}

export default function DragAndDrop({ fileUrl, setFile }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    setError("");

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setError("Solo se permiten imágenes (.png, .jpg, .jpeg)");
      return;
    }

    setFile(file);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Se eliminará la imagen cargada.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      setFile(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 min-w-[400px]">
      {fileUrl ? (
        <div className="relative w-full max-w-sm mx-auto">
          <img
            src={fileUrl}
            alt="Vista previa"
            className="rounded-lg w-full h-auto object-contain shadow-md"
          />
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full shadow hover:bg-red-700 transition"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            <div className="flex flex-col gap-1">
              <p className="font-medium">
                {isDragging
                  ? "Suelta la imagen aquí"
                  : "Arrastra tu imagen aquí"}
              </p>
              <p className="text-gray-500 text-sm">o</p>
              <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                Selecciona una imagen
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileInput}
                  accept=".png, .jpg, .jpeg"
                />
              </label>
            </div>

            <p className="text-gray-500 text-sm mt-2">
              Formatos soportados: .png, .jpg, .jpeg
            </p>
          </div>
        </div>
      )}

      <span className="text-red-500">{error}</span>
    </div>
  );
}
