import { useNavigate } from "react-router-dom";
import { Post } from "@/interfaces/Post";

import PostVertical from "../Post/PostVertical";

interface Props {
  posts: Array<Post[]>;
}

const videos = [
  "https://www.youtube.com/watch?v=EFRKMLQRWkw&sttick=0",
  "https://youtu.be/d8t946x5Q_E?si=GpaFB7t5L0VbxtN3",
  "https://www.faustinee.com/api/uploads/files/victoria-secret.mp4",
];

export default function CategoriesSection({ posts }: Props) {
  const navigate = useNavigate();
  const categories = ["Moda", "Tendencias", "Hombres"];

  const toEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtu\.be\/|v=)([^&\n?#]+)/);
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : url;
  };

  return (
    <section className="flex flex-col max-w-[1200px] mx-auto">
      <div className="grow flex flex-col md:p-4">
        {categories.map((cat, i) => (
          <div key={cat}>
            <div className="w-full p-5 ps-0 ms-4 md:ms-4">
              <h3 className="CustomFont ps-6 text-6xl text-gray-600 font-bold border-s-4 border-secondary">
                {cat}
              </h3>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:h-[400px]">
              {posts[i]?.map((post) => (
                <div className="grow max-w-[500px] w-full h-full">
                  <PostVertical key={post.id} post={post} />
                </div>
              ))}
            </div>
            <div className="flex justify-center w-full">
              <button
                className="font-text my-6 mx-auto py-1 px-3 border text-gray-400 border-gray-400 hover:border-secondary hover:text-secondary"
                onClick={() => navigate(cat.split(" ").join("-").toLowerCase())}
              >
                MÁS SOBRE {cat.toUpperCase()}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full m-x-auto p-4 border-t border-dashed border-[#DDD]">
        {videos.map((url, idx) => (
          <div
            key={idx}
            className="relative flex justify-center items-center w-full pb-[52%] md:pb-[26%] h-0 overflow-hidden shadow-lg"
          >
            {url.includes(".mp4") ? (
              <video
                src={url}
                title={`Video ${idx + 1}`}
                controls
                className="absolute top-0 left-0 w-full h-full"
              />
            ) : (
              <iframe
                src={toEmbedUrl(url)}
                title={`YouTube video ${idx + 1}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
