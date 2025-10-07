import { useEffect, useState } from "react";
import { cleanEscapedHtml } from "@/lib/utils";
import { usePosts } from "@/hooks/usePost";
import { Post } from "@/interfaces/Post";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import "reactjs-tiptap-editor/style.css";

interface Props {
  id: string;
  post?: Post;
}

const Nota = ({ id, post }: Props) => {
  const posts = usePosts();
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  useEffect(() => {
    if (post) setCurrentPost(post);
  }, [post]);

  useEffect(() => {
    if (id) {
      const data = posts.data.find((post) => post.slug === id);
      const byCategory = posts.byCategory.data.find((post) => post.slug === id);
      const category1 = posts.categorySection.category1.find(
        (post) => post.slug === id
      );
      const category2 = posts.categorySection.category2.find(
        (post) => post.slug === id
      );
      const category3 = posts.categorySection.category3.find(
        (post) => post.slug === id
      );

      if (data) setCurrentPost(data);
      else if (byCategory) setCurrentPost(byCategory);
      else if (category1) setCurrentPost(category1);
      else if (category2) setCurrentPost(category2);
      else if (category3) setCurrentPost(category3);
      else {
        posts.getBySlug(id).then((post) => {
          setCurrentPost(post);
        });
      }
    }
  }, [id, posts.data]);

  return (
    <div className="font-text text-gray-800">
      <Header />

      {/* Título principal */}
      <header className="max-w-[1000px] mx-auto text-gray-800 px-6 pt-10 text-center">
        <h1 className="CustomFont text-5xl md-text-5xl font-title">
          {currentPost?.title}
        </h1>
        <div className="h-1 w-20 bg-primary mx-auto mt-4 rounded-full" />
        <p className="w-full mt-6 mb-4 text-start text-sm text-gray-400">
          {currentPost?.author}{" "}
          {currentPost?.date && new Date(currentPost?.date).toLocaleString()}
        </p>
      </header>

      {/* Contenido principal */}
      <main className="Nota ProseMirror max-w-[1000px] mx-auto px-6 pb-12 space-y-10">
        {currentPost && (
          <div
            className="prose-img-custom text-lg font-text"
            dangerouslySetInnerHTML={{
              __html: cleanEscapedHtml(currentPost?.contentHtml || ""),
            }}
          />
        )}
        <p className="text-sm text-gray-400">
          {currentPost?.author}{" "}
          {currentPost?.date && new Date(currentPost?.date).toLocaleString()}
        </p>
      </main>
      <div className="max-w-[1000px] mx-auto px-6 pb-12">
        <p className="text-sm text-secondary">
          © 2025 Faustinee. Todos los derechos reservados. Queda prohibida la
          reproducción total o parcial de este contenido, por cualquier medio o
          procedimiento, sin la autorización previa y por escrito de la
          editorial.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Nota;
