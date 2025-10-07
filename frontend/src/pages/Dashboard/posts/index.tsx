import { useState, useEffect, useMemo, useCallback } from "react";
import { SquarePlus, Pencil, Trash, Pin } from "lucide-react";
import { Post, PostState } from "@/interfaces/Post";
import { usePosts } from "@/hooks/usePost";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

import Layout from "@/components/Dashboard/Layout";
import SearchFilter from "@/components/Dashboard/SearchFilter";
import PaginatedTable from "@/components/Dashboard/PaginatedTable";
import BlogEditor from "@/components/BlogEditor";
import Modal from "@/components/Modal";

const itemsPerPage = 6;

export default function PostTable() {
  const { data, page, get } = usePosts();
  const { get: fetchPosts, deleteById, create, update } = usePosts();
  const [search, setSearch] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [openForm, setOpenForm] = useState<boolean>(false);

  // Estados para modales
  const [modalStateVisible, setModalStateVisible] = useState<boolean>(false);
  const [modalFixedVisible, setModalFixedVisible] = useState<boolean>(false);
  const [postToChange, setPostToChange] = useState<Post | null>(null);

  // Estados temporales para fijación en modal
  const [fixedHomeTemp, setFixedHomeTemp] = useState<boolean>(false);
  const [fixedCategoryTemp, setFixedCategoryTemp] = useState<boolean>(false);

  useEffect(() => {
    fetchPosts(1, itemsPerPage);
  }, []);

  const handleDeletePost = useCallback(
    async (post: Post) => {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        html: `La publicación <b>${post.title}</b> será eliminada.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        try {
          await deleteById(post.id!);
          Swal.fire("¡Eliminado!", `La publicación fue eliminada.`, "success");
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "No se pudo eliminar la publicación.", "error");
        }
      }
    },
    [deleteById]
  );

  const handleChangeState = async (post: Post, newState: PostState) => {
    const result = await Swal.fire({
      title: "¿Confirmar cambio?",
      text: `¿Quieres cambiar la publicación "${post.title}" a estado ${newState}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await update({ ...post, state: newState }, null);
        Swal.fire(
          "¡Actualizado!",
          "El estado de la publicación cambió.",
          "success"
        );
        fetchPosts(page.current, itemsPerPage);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo cambiar el estado.", "error");
      }
    }
  };

  const handleChangeFixed = async (
    post: Post,
    fixedHome: boolean,
    fixedCategory: boolean
  ) => {
    const result = await Swal.fire({
      title: "¿Confirmar cambio?",
      text: `¿Quieres actualizar la fijación de "${post.title}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await update({ ...post, fixedHome, fixedCategory }, null);
        Swal.fire(
          "¡Actualizado!",
          "La fijación de la publicación cambió.",
          "success"
        );
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo cambiar la fijación.", "error");
      }
    }

    setModalFixedVisible(false);
  };

  const getStateClasses = (state: PostState) => {
    switch (state) {
      case PostState.PUBLICADO:
        return "bg-green-100 text-green-700 hover:bg-green-200";
      case PostState.OCULTO:
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
      case PostState.BORRADOR:
      default:
        return "bg-gray-200 text-gray-500 opacity-70 hover:opacity-100";
    }
  };

  const postColumns = useMemo(
    () => [
      {
        key: "img",
        label: "Portada",
        render: (post: Post) => (
          <img
            src={post.coverUrl}
            alt="img"
            className="h-16 w-24 object-cover rounded"
          />
        ),
      },
      { key: "title" as keyof Post, label: "Título" },
      { key: "author", label: "Autor" },
      {
        key: "state",
        label: "Estado",
        render: (post: Post) => (
          <span
            onClick={() => {
              setPostToChange(post);
              setModalStateVisible(true);
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${getStateClasses(
              post.state as PostState
            )}`}
          >
            {post.state}
          </span>
        ),
      },
/*       {
        key: "fixed",
        label: "Fijado",
        render: (post: Post) => (
          <div
            onClick={() => {
              setPostToChange(post);
              setFixedHomeTemp(post.fixedHome);
              setFixedCategoryTemp(post.fixedCategory);
              setModalFixedVisible(true);
            }}
            className="flex gap-2 cursor-pointer"
          >
            {post.fixedHome && (
              <span className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200">
                <Pin size={14} /> Inicio
              </span>
            )}
            {post.fixedCategory && (
              <span className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200">
                <Pin size={14} /> Categoría
              </span>
            )}
            {!post.fixedHome && !post.fixedCategory && (
              <span className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 bg-gray-200 text-gray-500 opacity-70 hover:opacity-100">
                <Pin size={14} /> No fijado
              </span>
            )}
          </div>
        ),
      }, */
      {
        key: "date",
        label: "Fecha",
        render: (post: Post) => new Date(post.date).toLocaleDateString(),
      },
      {
        key: "acciones",
        label: "Acciones",
        render: (post: Post) => (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedPost(post);
                setOpenForm(true);
              }}
            >
              <Pencil />
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeletePost(post)}
            >
              <Trash />
            </Button>
          </div>
        ),
      },
    ],
    [handleDeletePost]
  );

  const handleSubmit = (post: Post, cover?: File | null) => {
    console.log("onSave");
    if (selectedPost) {
      handleEditPost(post, cover!);
    } else {
      handleAddPost(post, cover!);
    }
  };

  const handleAddPost = async (newPost: Post, cover?: File | null) => {
    create(newPost, cover).then(() => {
      setOpenForm(false);
      setSearch("");
    });
  };

  const handleEditPost = async (updatedPost: Post, cover?: File | null) => {
    try {
      await update(updatedPost, cover);
      setOpenForm(false);
      setSelectedPost(null);
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      Swal.fire("Error", "No se pudo actualizar la publicación.", "error");
    }
  };

  function handleGetPage(page: number) {
    get(page, itemsPerPage);
  }

  function handleCloseForm() {
    setSelectedPost(null);
    setOpenForm(false);
  }

  return (
    <Layout>
      <div className="relative p-6 space-y-4">
        {openForm && (
          <BlogEditor
            data={selectedPost}
            onSave={handleSubmit}
            onClose={handleCloseForm}
          />
        )}
        <h1 className="text-2xl font-bold">Publicaciones</h1>
        <div className="flex gap-4 justify-between">
          <SearchFilter
            search={search}
            setSearch={setSearch}
            placeholder="Buscar publicación..."
          />
          <Button onClick={() => setOpenForm(true)} className="text-white">
            <SquarePlus className="mr-2" /> Nueva publicación
          </Button>
        </div>
        <PaginatedTable
          data={data}
          columns={postColumns}
          currentPage={page.current}
          totalPages={page.totalPages}
          onPageChange={handleGetPage}
        />
      </div>

      {/* Modal para cambiar estado */}
      <Modal
        visible={modalStateVisible}
        title="Cambiar estado"
        onClose={() => setModalStateVisible(false)}
      >
        <div className="p-6 space-y-4">
          <p>Selecciona el nuevo estado para la publicación</p>

          <div className="flex flex-col gap-2">
            {Object.values(PostState).map((state) => (
              <Button
                key={state}
                variant="outline"
                className={getStateClasses(state as PostState)}
                onClick={() => {
                  if (postToChange)
                    handleChangeState(postToChange, state as PostState);
                  setModalStateVisible(false);
                }}
              >
                {state}
              </Button>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setModalStateVisible(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal para cambiar fijación */}
      <Modal
        visible={modalFixedVisible}
        title="Cambiar fijación"
        onClose={() => setModalFixedVisible(false)}
      >
        <div className="p-6 space-y-4">
          <p>Selecciona dónde quieres fijar esta publicación</p>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={fixedHomeTemp}
                onChange={(e) => setFixedHomeTemp(e.target.checked)}
              />
              <span className="flex items-center gap-1">
                <Pin size={14} className="text-blue-600" /> Inicio
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={fixedCategoryTemp}
                onChange={(e) => setFixedCategoryTemp(e.target.checked)}
              />
              <span className="flex items-center gap-1">
                <Pin size={14} className="text-purple-600" /> Categoría
              </span>
            </label>
          </div>

          <div className="flex justify-end mt-6 gap-2">
            <Button
              variant="outline"
              onClick={() => setModalFixedVisible(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                console.log(postToChange, fixedHomeTemp, fixedCategoryTemp);
                if (postToChange)
                  handleChangeFixed(
                    postToChange,
                    fixedHomeTemp,
                    fixedCategoryTemp
                  );
              }}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Guardar
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
