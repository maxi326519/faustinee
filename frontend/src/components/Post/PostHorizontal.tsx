import { cleanEscapedHtml, extractTextFromHTML } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Image } from "lucide-react";
import { Post } from "@/interfaces/Post";

interface Props {
  post: Post;
}

export default function PostHorizonal({ post }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className={`flex gap-4 m-w-[300px] w-full cursor-pointer overflow-hidden ${
        post?.fixedCategory ? "border-b border-gray" : ""
      }`}
      onClick={() =>
        navigate(`/${post.category.split(" ").join("-")}/${post.slug}`)
      }
    >
      <div className="w-[150px] h-[120px] md:w-[300px] md:h-[200px] shrink-0 flex items-center justify-center overflow-hidden bg-gray-100 border border-[#DDD]">
        {post.coverUrl ? (
          <img
            src={post.coverUrl}
            alt="featured"
            className="w-full h-full object-cover"
          />
        ) : (
          <Image />
        )}
      </div>
      <div className="grow">
        <span className={`text-xs font-semibold text-secondary`}>
          {post.category?.split("-")?.join(" ")?.toUpperCase()}
        </span>
        <h2
          className="text-base md:text-xl md:w-[80%] leading-2 text-gray-800 font-title font-bold"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {post.title.toUpperCase()}
        </h2>
        <p
          className="text-normal text-gray-700 font-text max-w-[300px] overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {extractTextFromHTML(cleanEscapedHtml(post.contentHtml))}
        </p>
        <div className="flex justify-between w-full text-gray-400 text-xs font-text">
          <span>By {post.author}</span>
        </div>
      </div>
    </div>
  );
}
