import { useState } from "react";
import { Post } from "@/interfaces/Post";

import PostVertical from "../Post/PostVertical";

interface Cover {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  state: string;
  pinned: boolean;
}

interface Props {
  posts: Post[];
  covers: Cover[];
}

export default function NewsSection({ posts, covers }: Props) {
  const [coverIndex, setCoverIndex] = useState<number | null>(null);

  const publishedCovers = covers.filter(c => c.state === 'Publicado');

  return (
    <section className="flex flex-col md:flex-row gap-4 m-auto max-w-[1200px] w-full overflow-hidden">
      {coverIndex !== null && (
        <div className="fixed z-50 top-0 left-0 flex justify-center items-center w-screen h-screen p-4 bg-[#0008]">
          <div className="relative max-w-full max-h-full flex justify-center items-center">
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white"
              onClick={() => setCoverIndex(null)}
            >
              x
            </button>
            {publishedCovers[coverIndex - 1] && (
              <button
                className="absolute top-1/2 left-4 w-10 h-10 rounded-full bg-white transform -translate-y-1/2"
                onClick={() => setCoverIndex(coverIndex - 1)}
              >
                {"<"}
              </button>
            )}
            {publishedCovers[coverIndex + 1] && (
              <button
                className="absolute top-1/2 right-4 w-10 h-10 rounded-full bg-white transform -translate-y-1/2"
                onClick={() => setCoverIndex(coverIndex + 1)}
              >
                {">"}
              </button>
            )}
            <img
              src={publishedCovers[coverIndex]?.imageUrl}
              alt="cover"
              className="max-w-full max-h-full object-contain"
              style={{
                maxHeight: "calc(100vh - 2rem)",
                maxWidth: "calc(100vw - 2rem)",
              }}
            />
          </div>
        </div>
      )}

      <div className="grow flex flex-col gap-6 p-0 md:p-4 pb-16">
        <div className="w-full p-5 ps-0">
          <h3 className="CustomFont ps-6 font-title text-4xl text-gray-600 font-bold border-s-4 border-secondary">
            Más Notas
          </h3>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 gap-y-10">
          {posts.map((post) => (
            <div className="relative mb-4">
              <div className="max-h-[400px] overflow-hidden">
                <PostVertical key={post.id} post={post} />
              </div>
              <div className="absolute -bottom-4 left-0 w-10 h-[1px] bg-secondary" />
            </div>
          ))}
        </div>
      </div>

      <div className="border-b md:border-b-0 md:border-r border-dashed border-[#DDD]"></div>

      <div className="grow md:col-span-1 p-4">
        <div className="flex flex-col gap-4">
          <div className="w-full p-5 ps-0">
            <h3 className="CustomFont ps-6 font-title text-4xl text-gray-600 font-bold border-s-4 border-secondary">
              Portadas
            </h3>
          </div>
          <div className="flex flex-col items-center gap-4">
            {publishedCovers.slice(0, 4).map((cover, i) => (
              <div
                key={cover.id}
                className="shrink-0 flex items-center justify-center w-[200px] rounded-sm overflow-hidden bg-gray-100 cursor-pointer hover:opacity-50"
                onClick={() => setCoverIndex(i)}
              >
                <img
                  src={cover.imageUrl}
                  alt="cover"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <button
            className="p-2 rounded-sm text-gray-600 hover:bg-gray-100 hover:text-primary"
            onClick={() => setCoverIndex(publishedCovers.length - 1)}
          >
            VER MÁS
          </button>
        </div>
      </div>
    </section>
  );
}
