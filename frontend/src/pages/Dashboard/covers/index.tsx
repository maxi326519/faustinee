import { SquarePlus, Trash, Pin, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Swal from "sweetalert2";
import Layout from "@/components/Dashboard/Layout";

interface Cover {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  state: "Publicado" | "Oculto";
  pinned: boolean;
}

export default function CoversTable() {
  const [covers, setCovers] = useState<Cover[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    image: null as File | null,
  });

  useEffect(() => {
    fetchCovers();
  }, []);

  const fetchCovers = async () => {
    try {
      const response = await axios.get("/covers");
      setCovers(response.data);
    } catch (error) {
      console.error("Failed to fetch covers:", error);
    }
  };

  const handleUpload = async () => {
    if (!uploadData.title || !uploadData.image) return;

    const formData = new FormData();
    formData.append("title", uploadData.title);
    formData.append("description", uploadData.description);
    formData.append("image", uploadData.image);

    try {
      await axios.post("/covers", formData);
      setIsUploadOpen(false);
      setUploadData({ title: "", description: "", image: null });
      fetchCovers();
      Swal.fire("Éxito", "Cover subido correctamente", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo subir el cover", "error");
    }
  };

  const handlePin = async (cover: Cover) => {
    try {
      // Unpin all others
      await Promise.all(
        covers
          .filter((c) => c.pinned && c.id !== cover.id)
          .map((c) => axios.put(`/covers/${c.id}`, { ...c, pinned: false }))
      );
      // Pin this one
      await axios.put(`/covers/${cover.id}`, {
        ...cover,
        pinned: !cover.pinned,
      });
      fetchCovers();
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el pin", "error");
    }
  };

  const handleToggleState = async (cover: Cover) => {
    try {
      await axios.put(`/covers/${cover.id}`, {
        ...cover,
        state: cover.state === "Publicado" ? "Oculto" : "Publicado",
      });
      fetchCovers();
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const handleDelete = async (cover: Cover) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `El cover "${cover.title}" será eliminado.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/covers/${cover.id}`);
        fetchCovers();
        Swal.fire("Eliminado", "Cover eliminado correctamente", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el cover", "error");
      }
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Covers</h1>
        <Button onClick={() => setIsUploadOpen(true)} className="bg-primary">
          <SquarePlus /> Subir Nuevo Cover
        </Button>

        {isUploadOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl mb-4">Subir Cover</h2>
              <input
                type="text"
                placeholder="Título"
                value={uploadData.title}
                onChange={(e) =>
                  setUploadData({ ...uploadData, title: e.target.value })
                }
                className="w-full mb-2 p-2 border"
              />
              <textarea
                placeholder="Descripción"
                value={uploadData.description}
                onChange={(e) =>
                  setUploadData({ ...uploadData, description: e.target.value })
                }
                className="w-full mb-2 p-2 border"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setUploadData({
                    ...uploadData,
                    image: e.target.files?.[0] || null,
                  })
                }
                className="w-full mb-4"
              />
              <div className="flex gap-2">
                <Button onClick={handleUpload}>Subir</Button>
                <Button
                  variant="outline"
                  onClick={() => setIsUploadOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {covers.map((cover) => (
            <div key={cover.id} className="border p-4 rounded-lg">
              <img
                src={cover.imageUrl}
                alt={cover.title}
                className="w-full h-32 object-cover mb-2"
              />
              <h3 className="font-bold">{cover.title}</h3>
              <p className="text-sm text-gray-600">{cover.description}</p>
              <p className="text-sm">Estado: {cover.state}</p>
              <p className="text-sm">Fijado: {cover.pinned ? "Sí" : "No"}</p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => handlePin(cover)}>
                  <Pin />
                </Button>
                <Button size="sm" onClick={() => handleToggleState(cover)}>
                  {cover.state === "Publicado" ? <EyeOff /> : <Eye />}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(cover)}
                >
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
