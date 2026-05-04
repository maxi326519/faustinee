import usePostStore, { CategorySection } from "@/stores/postsStores";
import { Post, PostState } from "@/interfaces/Post";
import { useCallback } from "react";
import useLoading from "./useLoading";
import Swal from "sweetalert2";
import axios from "axios";

export function usePosts() {
  const loading = useLoading();
  const posts = usePostStore();

  const compressImage = (file: File, maxSizeMB: number = 5): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo proporción
        let { width, height } = img;
        const maxSize = maxSizeMB * 1024 * 1024; // Convertir a bytes
        
        // Si la imagen es muy grande, reducir tamaño
        if (file.size > maxSize) {
          const ratio = Math.sqrt(maxSize / file.size);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convertir a blob con compresión
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file); // Fallback al archivo original
          }
        }, 'image/jpeg', 0.8); // 80% de calidad
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadImage = async (
    img: File,
    postId: string
  ): Promise<string | undefined> => {
    try {
      // Comprimir imagen si es muy grande (>5MB)
      const fileToUpload = img.size > 5 * 1024 * 1024 ? await compressImage(img) : img;
      
      const formData = new FormData();
      formData.append("file", fileToUpload);
      const response = await axios.post(`/posts/${postId}/img`, formData);
      if (!response.data.url) throw new Error("Error to upload this image");

      return response.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
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
        throw new Error("Error al subir la imagen");
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
        `/posts?page=1&items=3&mustRead=true&state=Publicado`
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

      // Agregar campos de forma explícita como en covers
      formData.append("title", post.title);
      formData.append("contentHtml", post.contentHtml);
      formData.append("category", post.category || "");
      formData.append("state", post.state || "Borrador");
      formData.append("author", post.author || "");
      formData.append("tags", post.tags || "");
      formData.append("fixedHome", String(post.fixedHome || false));
      formData.append("fixedCategory", String(post.fixedCategory || false));
      formData.append("slug", post.slug || "");

      // Agregar archivo si existe
      if (file) formData.append("file", file);

      // Create post
      const response = await axios.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

      // Upload images del contenido
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

      // Subir portada si existe usando uploadImage
      let coverUrl = post.coverUrl || "";
      if (file) {
        loading.setMessage("Subiendo portada...");
        const uploadedUrl = await uploadImage(file, post.id!);
        if (uploadedUrl) {
          coverUrl = uploadedUrl;
        }
      }

      // Preparar datos para actualizar (sin FormData)
      const updateData = {
        title: post.title,
        contentHtml: updatedText,
        category: post.category || "",
        state: post.state || "Borrador",
        author: post.author || "",
        tags: post.tags || "",
        fixedHome: post.fixedHome || false,
        fixedCategory: post.fixedCategory || false,
        slug: post.slug || "",
        coverUrl: coverUrl,
      };

      // Enviar datos como JSON normal
      const response = await axios.put(`/posts/${post.id}`, updateData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
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
