import { Post } from "@/interfaces/Post";
import PostHorizonal from "../Post/PostHorizontal";

interface Props {
  title: string;
  posts: Post[];
}

export default function PostsList({ posts }: Props) {
  return (
    <div className="flex-1">
      <div className="flex flex-col gap-4">
        {posts.map((post, index) => (
          <PostHorizonal key={index} post={post} />
        ))}
      </div>
    </div>
  );
}
