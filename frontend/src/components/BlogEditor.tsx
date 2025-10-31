import { ArrowLeft, ArrowUpLeftFromSquare, Save } from "lucide-react";
import { initPost, Post, PostState } from "@/interfaces/Post";
import { useEffect, useState } from "react";
import { cleanEscapedHtml } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import DragAndDrop from "@/components/ui/DragAndDrop";
import EditorTiptap from "./EditorTipTap";
import Nota from "./Nota";

interface Props {
  data?: Post | null;
  onSave: (post: Post, cover?: File) => void;
  onClose: () => void;
}

const categories = [
  { key: "belleza", label: "Belleza" },
  { key: "editorial", label: "Editorial" },
  { key: "entrevistas", label: "Entrevistas" },
  { key: "estilo", label: "Estilo" },
  { key: "estilo-de-vida", label: "Estilo de vida" },
  { key: "hombres", label: "Hombres" },
  { key: "lo-ultimo", label: "Lo último" },
  { key: "moda", label: "Moda" },
  { key: "noticias", label: "Noticias" },
  { key: "tendencias", label: "Tendencias" },
  { key: "viajes", label: "Viajes" },
];

const BlogEditor: React.FC<Props> = ({ data, onSave, onClose }) => {
  const [type, setType] = useState<number>(1);
  const [post, setPost] = useState<Post>(initPost());
  const [cover, setCover] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [preview, setPreview] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setPost({ ...data, contentHtml: cleanEscapedHtml(data.contentHtml) });
      setCoverUrl(data.coverUrl);
    }
  }, [data]);

  // Forzar modo claro para evitar cambios de tema
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const handleChange = (key: string, value: any) => {
    setPost((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (publish: boolean) => {

    if (
      publish &&
      post.title &&
      post.contentHtml &&
      post.author &&
      (data?.coverUrl || (!data && cover))
    ) {
      onSave({ ...post, state: PostState.PUBLICADO }, cover!);
    }

    if (!publish) {
      onSave({ ...post }, cover!);
    }

    console.log("Actualizando", post);
  };

  const handleSetCover = (file: File | null) => {
    if (file) {
      setCover(file);
      setCoverUrl(URL.createObjectURL(file));
    } else {
      setCover(null);
      setCoverUrl("");
    }
  };

  const handleTogglePreview = () => {
    setPreview(!preview);
  };

  return (
    <div className="fixed z-50 top-0 left-0 flex flex-col w-full h-screen bg-gray-100 overflow-hidden">
      <header className="z-20 top-0 left-0 flex justify-between w-full p-4 shadow-lg bg-white">
        <div className="flex">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft />
            Volver
          </Button>
          <h2 className="ms-4 text-2xl text-[#233] font-bold">
            {data?.id ? "Editar" : "Nueva"} publicación
          </h2>
        </div>
        <div className="flex gap-4">
          <Button
            variant={preview ? "default" : "outline"}
            onClick={handleTogglePreview}
          >
            Preview
          </Button>
          <Button variant="outline" onClick={() => handleSave(false)}>
            <Save />
            Guardar
          </Button>
          <Button variant="outline" onClick={() => handleSave(true)}>
            <ArrowUpLeftFromSquare />
            Publicar
          </Button>
        </div>
      </header>

      {preview ? (
        <div className="overflow-auto">
          <Nota id="" post={post} />
        </div>
      ) : (
        <div className="relative flex justify-center gap-6 w-full h-full p-4 overflow-y-auto">
          {/* PANEL IZQUIERDO */}
          <div className="sticky divide-y flex flex-col gap-4 top-0 max-w-[1000px] w-full h-min p-4 rounded-lg border border-[#DDD] bg-white">
            {/* Toggle contenido/configuración */}
            <div className="flex rounded-lg border border-gray-300 bg-gray-200">
              <Button
                variant="ghost"
                className={`flex-grow h-full text-lg font-semibold ${
                  type === 1
                    ? "bg-white text-black"
                    : "bg-transparent text-gray-700 hover:text-gray-900"
                } shadow-none`}
                onClick={() => setType(1)}
              >
                Contenido
              </Button>
              <Button
                variant="ghost"
                className={`flex-grow h-full text-lg font-semibold ${
                  type === 0
                    ? "bg-white text-black"
                    : "bg-transparent text-gray-700 hover:text-gray-900"
                } shadow-none`}
                onClick={() => setType(0)}
              >
                Configuración
              </Button>
            </div>

            {/* CONTENIDO */}
            {type ? (
              <div className="h-max overflow-hidden">
                <div className="w-full h-full">
                  {((data && post.contentHtml) || !data) && (
                    <EditorTiptap
                      value={post.contentHtml}
                      onChange={(value) => handleChange("contentHtml", value)}
                    />
                  )}
                </div>
              </div>
            ) : (
              /* CONFIGURACIÓN */
              <div className="divide-y flex flex-col gap-4 w-full p-4">
                {/* Título */}
                <div className="w-full">
                  <span className="text-gray-800 font-semibold">Título:</span>
                  <div className="m-auto border rounded-sm overflow-hidden">
                    <input
                      type="text"
                      className="w-full rounded p-4 text-center text-2xl font-bold focus:outline-blue-800"
                      placeholder="Título de la publicación"
                      value={post.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                    />
                  </div>
                </div>

                {/* Portada + detalles */}
                <div className="flex gap-2">
                  <div>
                    <h3 className="text-xl font-bold">Portada</h3>
                    <DragAndDrop fileUrl={coverUrl} setFile={handleSetCover} />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    {/* Categoría */}
                    <label>
                      Categoría
                      <select
                        className="w-full border rounded p-2"
                        value={post.category}
                        onChange={(e) =>
                          handleChange("category", e.target.value)
                        }
                      >
                        <option value="">Seleccionar categoría...</option>
                        {categories.map((item) => (
                          <option key={item.key} value={item.key}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    {/* Autor */}
                    <label>
                      Autor
                      <Input
                        type="text"
                        name="author"
                        value={post.author}
                        onChange={(e) => handleChange("author", e.target.value)}
                      />
                    </label>

                    {/* Fecha */}
                    <label>
                      Fecha
                      <Input
                        type="date"
                        name="date"
                        value={
                          post.date
                            ? (typeof post.date === 'string' 
                                ? post.date.split('T')[0] 
                                : new Date(post.date).toISOString().split('T')[0])
                            : new Date().toISOString().split('T')[0]
                        }
                        onChange={(e) => handleChange("date", new Date(e.target.value))}
                      />
                    </label>

                    {/* Checkboxes de fijar */}
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={post.fixedHome || false}
                        onChange={(e) =>
                          handleChange("fixedHome", e.target.checked)
                        }
                      />
                      Fijar en inicio
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={post.fixedCategory || false}
                        onChange={(e) =>
                          handleChange("fixedCategory", e.target.checked)
                        }
                      />
                      Fijar en su categoría
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogEditor;
