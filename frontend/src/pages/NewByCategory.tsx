import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { usePosts } from "@/hooks/usePost";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostVertical from "@/components/Post/PostVertical";

const categories = [
  { key: "inicio", label: "Inicio" },
  { key: "editorial", label: "Editorial" },
  { key: "moda", label: "Moda" },
  { key: "estilo", label: "Estilo" },
  { key: "belleza", label: "Belleza" },
  { key: "tendencias", label: "Tendencias" },
  { key: "hombres", label: "Hombres" },
  // { key: "estilo-de-vida", label: "Estilo de vida" },
  { key: "entrevistas", label: "Entrevistas" },
  { key: "lo-ultimo", label: "Lo último" },
  { key: "noticias", label: "Noticias" },
  { key: "viajes", label: "Viajes" },
];

export default function NewByCategory() {
  const params = useParams();
  const key = params.id;
  const posts = usePosts();

  useEffect(() => {
    // TODO: get by category
    if (key) posts.getByCategory(key);
  }, [key]);

  return (
    <div className="flex flex-col items-center">
      <Header categorySelected={key || ""} />
      <div className="w-full p-10 bg-primary bg-opacity-10">
        <h3 className="CustomFont text-5xl text-center text-secondary font-bold">
          {categories.find((category) => category.key === key)?.label ||
            "Sin titulo"}
        </h3>
      </div>
      <div className="md:px-4 max-w-[1000px] w-full m-auto">
        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 py-4 max-w-[1000px]">
          {posts.byCategory.data.map((post) => (
            <div className="relative max-h-[400px] mb-4">
              <div className="h-[400px]">
                <PostVertical key={post.id} post={post} />
              </div>
              <div className="absolute -bottom-4 left-0 w-10 h-[1px] bg-secondary" />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
