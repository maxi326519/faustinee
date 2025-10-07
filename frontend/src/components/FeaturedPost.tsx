import { Post } from "@/interfaces/Post";
import PostLarge from "./Post/PostLargeL";

interface Props {
  post?: Post | null;
}

export default function FeaturedPost({ post }: Props) {
  return <PostLarge post={post} />;
}
