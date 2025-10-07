import { useEffect, useState } from "react";
import { usePosts } from "@/hooks/usePost";
import axios from "axios";

import Header from "@/components/Header";
import FeaturedPost from "@/components/FeaturedPost";
import NewsSection from "@/components/Layouts/NewsSection";
import PostVertical from "@/components/Post/PostVertical";
import PostHorizonal from "@/components/Post/PostHorizontal";
import CategoriesSection from "@/components/Layouts/CategoriesSection";
import Footer from "@/components/Footer";

interface Cover {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  state: string;
  pinned: boolean;
}

export default function Home() {
  const posts = usePosts();
  const [covers, setCovers] = useState<Cover[]>([]);
  const [pinnedCover, setPinnedCover] = useState<Cover | null>(null);

  useEffect(() => {
    posts.getHome();
    posts.get(1, 9);
    fetchCovers();
  }, []);

  const fetchCovers = async () => {
    try {
      // Obtener todas las portadas
      const response = await axios.get("/covers");
      setCovers(response.data);

      // Obtener la portada fijada más reciente
      const pinnedResponse = await axios.get("/covers/pinned");
      setPinnedCover(pinnedResponse.data);
    } catch (error) {
      console.error("Failed to fetch covers:", error);
    }
  };

  return (
    <div className="w-full text-[#1E1E1E] overflow-hidden">
      {pinnedCover && (
        <div className="fixed z-50 top-0 left-0 flex justify-center items-center p-6 w-screen h-screen bg-[#0008]">
          <div className="relative max-w-full max-h-full flex justify-center items-center">
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white"
              onClick={() => setPinnedCover(null)}
            >
              x
            </button>
            <img
              src={pinnedCover?.imageUrl}
              alt="cover"
              className="max-w-full max-h-full object-contain"
              style={{
                maxHeight: "calc(100vh - 3rem)",
                maxWidth: "calc(100vw - 3rem)",
              }}
            />
          </div>
        </div>
      )}

      <Header categorySelected="inicio" />

      {/* Escritorio */}
      <div className="w-full bg-gray-100">
        <div className="hidden md:grid grid-cols-3 grid-rows-3 gap-4 max-w-[1200px] mx-auto p-4">
          <div className="col-span-2 row-span-2 h-[450px]">
            {posts.latest?.[0] && <FeaturedPost post={posts.latest?.[0]} />}
          </div>
          <div className="row-span-2">
            {posts.latest[1] && <PostVertical post={posts.latest[1]} />}
          </div>
          <div className="col-span-3 flex gap-4 h-min">
            <div className="w-full">
              {posts.latest[3] && <PostHorizonal post={posts.latest[2]} />}
            </div>
            <div className="w-full">
              {posts.latest[4] && <PostHorizonal post={posts.latest[3]} />}
            </div>
          </div>
        </div>
      </div>

      {/* Mobil */}
      <div className="md:hidden flex flex-col gap-10 justify-center items-center mx-auto">
        {posts.latest?.[0] && (
          <div className="h-[60vh]">
            <FeaturedPost post={posts.latest?.[0]} />
          </div>
        )}
        {posts.latest[1] && <PostVertical post={posts.latest[1]} />}
        {posts.latest[3] && <PostVertical post={posts.latest[2]} />}
        {posts.latest[4] && <PostVertical post={posts.latest[3]} />}
      </div>

      <div className="w-full border-b border-[#DDD]" />

      <CategoriesSection
        posts={[
          posts.categorySection.category1.slice(0, 3),
          posts.categorySection.category2.slice(0, 3),
          posts.categorySection.category3.slice(0, 3),
        ]}
      />

      <div className="w-full border-b border-[#DDD]" />

      <NewsSection
        posts={posts.latest.slice(4, posts.latest.length)}
        covers={covers}
      />
      <Footer />
    </div>
  );
}
