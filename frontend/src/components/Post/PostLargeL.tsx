import { useNavigate } from "react-router-dom";
import { Post } from "@/interfaces/Post";

interface Props {
  post?: Post | null;
  titleSmall?: boolean;
  titleMedium?: boolean;
}

export default function PostLarge({ post, titleSmall, titleMedium }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex flex-col w-full h-full cursor-pointer overflow-hidden"
      onClick={() =>
        navigate(`/${post?.category.split(" ").join("-")}/${post?.slug}`)
      }
    >
      {/* Imagen de fondo con filtro oscuro y degradado */}
      <div className={`relative h-full w-full`}>
        {post?.coverUrl ? (
          <img
            src={post.coverUrl}
            alt="featured"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            No Image
          </div>
        )}
        {/* Overlay oscuro con degradado */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 flex flex-col gap-2 w-full p-4">
          <h2
            className={`text-white font-bold leading-tight ${
              titleSmall
                ? "text-medium md:text-lg"
                : titleMedium
                ? "text-lg md:text-xl"
                : "text-2xl md:text-3xl"
            }`}
          >
            {post?.title.toUpperCase()}
          </h2>

          <div className="flex justify-between items-center text-white">
            <span className="text-sm font-semibold uppercase text-secondary">
              {post?.category.split("-").join(" ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
