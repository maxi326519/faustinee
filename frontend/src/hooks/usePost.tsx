import usePostStore, { CategorySection } from "@/stores/postsStores";
import { Post, PostState } from "@/interfaces/Post";
import { useCallback } from "react";
import useLoading from "./useLoading";
import Swal from "sweetalert2";
import axios from "axios";

export function usePosts() {
  const loading = useLoading();
  const posts = usePostStore();

  const uploadImage = async (
    img: File,
    postId: string
  ): Promise<string | undefined> => {
    const formData = new FormData();
    formData.append("file", img);
    const response = await axios.post(`/posts/${postId}/img`, formData);
    if (!response.data.url) throw new Error("Error to upload this image");

    return response.data.url;
  };

  /**
   * Reemplaza las imágenes blob en el HTML por URLs subidas al servidor.
   * @param html HTML del post (con posibles imágenes blob)
   * @param postId ID del post para usar en la ruta del servidor
   * @returns HTML con los src actualizados
   */
  const replaceBlobImages = async (
    html: string,
    postId: string,
    onProgress?: (current: number, total: number) => void
  ): Promise<string> => {
    // Crear un contenedor DOM para manipular el HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const images = doc.querySelectorAll("img");
    const blobImages = Array.from(images).filter((img) =>
      img.src.startsWith("blob:")
    );

    let index = 0;
    for (const img of blobImages) {
      try {
        const res = await fetch(img.src);
        const blob = await res.blob();
        const file = new File([blob], "image.png", { type: blob.type });

        const url = await uploadImage(file, postId);
        if (url) {
          img.src = url;
        }

        if (onProgress) {
          onProgress(index + 1, blobImages.length);
        }
        index++;
      } catch (err) {
        console.warn("Error procesando imagen blob:", err);
      }
    }

    // Retornar el HTML actualizado (body.innerHTML preserva mejor que div.innerHTML)
    return doc.body.innerHTML;
  };

  function extractImageSources(html: string): string[] {
    const div = document.createElement("div");
    div.innerHTML = html;
    const images = div.querySelectorAll("img");
    return Array.from(images)
      .map((img) => img.getAttribute("src") || "")
      .filter((src) => src.startsWith("/uploads")); // solo las que están en el servidor
  }

  const fetchPosts = useCallback(async (page = 1, items = 10) => {
    try {
      loading.open();

      const response = await axios.get(
        `/posts?page=${page}&items=${items}&latest=true`
      );

      if (!response.data || !Array.isArray(response.data.items))
        throw new Error("Invalid response");

      const { items: postsData, page: pageInfo } = response.data;

      posts.set(postsData, pageInfo);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      loading.close();
    }
  }, []);

  const getHomePosts = useCallback(async () => {
    try {
      loading.open();

      // Latest
      const latestResponse = await axios.get(
        `/posts?page=1&items=13&latest=true&state=Publicado`
      );
      if (!latestResponse.data || !Array.isArray(latestResponse.data.items))
        throw new Error("Invalid response");

      // Must Reads
      const mustReadsResponse = await axios.get(
        `/posts?page=1&items=3&mustReads=true&state=Publicado`
      );
      if (
        !mustReadsResponse.data ||
        !Array.isArray(mustReadsResponse.data.items)
      )
        throw new Error("Invalid response");

      // Categories
      const postCategorySection: CategorySection = {
        category1: [],
        category2: [],
        category3: [],
      };

      let index = 0;
      for (const category of ["moda", "tendencias", "hombres"]) {
        const res = await axios.get(
          `/posts?page=1&items=4&category=${category}&state=Publicado`
        );
        if (!res.data || !Array.isArray(res.data.items))
          throw new Error("Invalid response");

        index++;
        postCategorySection[
          ("category" + index) as keyof typeof postCategorySection
        ] = res.data.items as Post[];
      }

      posts.setLatest(latestResponse.data.items);
      posts.setMustReads(mustReadsResponse.data.items);
      posts.setCategorySection(postCategorySection);
    } catch (error) {
      console.error("Failed to fetch home posts:", error);
    } finally {
      loading.close();
    }
  }, []);

  const getByCategory = useCallback(
    async (category: string, page = 1, items = 10) => {
      try {
        loading.open();

        const response = await axios.get(
          `/posts?page=${page}&items=${items}&latest=true&category=${category}&state=Publicado`
        );

        if (!response.data || !Array.isArray(response.data.items))
          throw new Error("Invalid response");

        const { items: postsData, page: pageInfo } = response.data;

        posts.setByCategory({
          page: pageInfo,
          category,
          data: postsData,
        });
      } catch (error) {
        console.error("Failed to fetch posts by category:", error);
      } finally {
        loading.close();
      }
    },
    []
  );

  const getBySlug = useCallback(async (slug: string) => {
    try {
      loading.open();

      const response = await axios.get(`/posts/${slug}`);

      if (!response.data) throw new Error("Invalid response");

      return response.data;
      return;
    } catch (error) {
      console.error("Failed to fetch posts by category:", error);
    } finally {
      loading.close();
    }
  }, []);

  const getNext = useCallback(async () => {
    try {
      const { current, items, totalPages } = posts.page;

      // No seguir si ya estamos en la última página
      if (current >= totalPages) return;

      loading.open();

      const nextPage = current + 1;
      const response = await axios.get(
        `/posts?page=${nextPage}&items=${items}&state=Publicado`
      );

      if (!response.data || !Array.isArray(response.data.items))
        throw new Error("Invalid response");

      const { items: newPosts, page: pageInfo } = response.data;

      // Append a los datos existentes
      posts.set([...posts.data, ...newPosts], pageInfo);
    } catch (error) {
      console.error("Failed to fetch next posts:", error);
    } finally {
      loading.close();
    }
  }, [posts.page, posts.data]);

  const getNextByCategory = useCallback(
    async (category: string) => {
      try {
        const { current, items, totalPages } = posts.byCategory.page;
        if (current >= totalPages) return;

        loading.open();

        const nextPage = current + 1;
        const response = await axios.get(
          `/posts?page=${nextPage}&items=${items}&latest=true&category=${category}&state=Publicado`
        );

        if (!response.data || !Array.isArray(response.data.items))
          throw new Error("Invalid response");

        const { items: newPosts, page: pageInfo } = response.data;

        // Append a los datos de esa categoría
        posts.setByCategory({
          page: pageInfo,
          category,
          data: [...posts.byCategory.data, ...newPosts],
        });
      } catch (error) {
        console.error(
          `Failed to fetch next posts for category ${category}:`,
          error
        );
      } finally {
        loading.close();
      }
    },
    [posts.byCategory]
  );

  const createPost = async (post: Post, file?: File | null) => {
    try {
      loading.open("Subiendo imagenes...");

      const formData = new FormData();
      if (file) formData.append("file", file);

      for (const key in post) {
        const value = post[key as keyof Post];
        if (
          value instanceof Blob ||
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          formData.append(
            key,
            key === "contentHtml" ? (value as string) : String(value)
          );
        }
      }

      // Create post
      const response = await axios.post("/posts", formData);
      const newPost = response.data as Post;
      if (!newPost) new Error("Error to create the post");

      // Upload images
      const updatedText = await replaceBlobImages(
        newPost.contentHtml,
        newPost.id!,
        (curr, total) =>
          loading.setMessage(`Subiendo imágenes: ${curr}/${total}`)
      );
      const postWidthImg: Post = { ...response.data, contentHtml: updatedText };

      console.log("Antes del put", postWidthImg, updatedText);

      // Upload text widht img urls
      await updatePost(postWidthImg);

      posts.add(postWidthImg);
      Swal.fire("Creado", "La publicación fue creada con éxito", "success");
    } catch (error) {
      console.error("Failed to create post:", error);
      throw new Error((error as Error).message);
      Swal.fire("Error", "Hubo un error al crear la publicación", "error");
    } finally {
      loading.close();
    }
  };

  const updatePost = async (post: Post, file?: File | null) => {
    try {
      loading.open("Subiendo imágenes...");

      // Upload images
      const originalImages = extractImageSources(post.contentHtml);
      const updatedText = await replaceBlobImages(
        post.contentHtml,
        post.id!,
        (curr, total) => {
          loading.setMessage(`Subiendo imágenes: ${curr}/${total}`);
        }
      );
      const newImages = extractImageSources(updatedText);

      // Detectar y eliminar imágenes que fueron quitadas
      const deletedImages = originalImages.filter(
        (src) => !newImages.includes(src)
      );
      await Promise.all(deletedImages.map(deleteImageFromServer));

      // Update post
      const formData = new FormData();
      if (file) formData.append("file", file);

      for (const key in post) {
        const value = post[key as keyof Post];

        if (key === "contentHtml") {
          formData.append("contentHtml", updatedText);
        } else if (
          value instanceof Blob ||
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          formData.append(key, String(value));
        }
      }

      console.log("Antes del put", updatedText);

      const response = await axios.put(`/posts/${post.id}`, formData);
      posts.update(response.data);

      Swal.fire(
        "Actualizado",
        "La publicación fue actualizada con éxito",
        "success"
      );
    } catch (error) {
      console.error("Failed to update post:", error);
      Swal.fire("Error", "Hubo un error al actualizar la publicación", "error");
    } finally {
      loading.close();
    }
  };

  const activePost = async (post: Post) => {
    updatePost({ ...post, state: PostState.PUBLICADO });
  };

  const deletePostById = async (postId: string) => {
    try {
      loading.open();
      await axios.delete(`/posts/${postId}`);
      posts.delete(postId);
      Swal.fire(
        "Eliminado",
        "La publicación fue eliminada con éxito",
        "success"
      );
    } catch (error) {
      console.error("Failed to delete post:", error);
      Swal.fire("Error", "Hubo un error al eliminar la publicación", "error");
    } finally {
      loading.close();
    }
  };

  async function deleteImageFromServer(src: string) {
    try {
      await axios.delete(`/posts/img`, { data: { src } });
    } catch (err) {
      console.error("Error deleting image:", src, err);
    }
  }

  return {
    // Page
    latest: posts.latest,
    mustReads: posts.mustReads,
    categorySection: posts.categorySection,
    byCategory: posts.byCategory,
    getHome: getHomePosts,
    getByCategory: getByCategory,
    getNextByCategory,

    // Dashboard
    data: posts.data,
    page: posts.page,
    get: fetchPosts,
    getBySlug,
    getNext,
    create: createPost,
    uploadImage,
    update: updatePost,
    active: activePost,
    deleteById: deletePostById,
  };
}
