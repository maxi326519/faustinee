import { useNavigate } from "react-router-dom";
import { Post } from "@/interfaces/Post";
import { cleanEscapedHtml, extractTextFromHTML } from "@/lib/utils";

interface Props {
  post?: Post | null;
}

export default function PostVertical({ post }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className={`relative flex flex-col w-full h-full cursor-pointer overflow-hidden ${
        post?.fixedCategory ? "border border-b-2 border-gray-200 border-b-secondary shadow-sm" : ""
      }`}
      onClick={() =>
        navigate(`/${post?.category.split(" ").join("-")}/${post?.slug}`)
      }
    >
      <div className="relative w-full min-h-[250px] max-h-[250x] h-[250px]">
        {post?.coverUrl ? (
          <img
            src={post?.coverUrl}
            alt="featured"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            No Image
          </div>
        )}
      </div>
      {/* Encabezado: categoría y fecha */}
      <div className="flex justify-between items-center p-2 text-white">
        <span className="text-xs font-semibold uppercase text-secondary">
          {post?.category.split("-").join(" ")}
        </span>
      </div>

      {/* Título */}
      <h2 className="p-2 pt-0 text-gray-800 text-2xl md:text-xl font-bold leading-tight">
        {post?.title.toUpperCase()}
      </h2>

      <p
        className="p-2 pt-0 text-normal text-gray-700 h-[75px] font-text overflow-hidden"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {extractTextFromHTML(cleanEscapedHtml(post?.contentHtml || ""))}
      </p>
    </div>
  );
}
