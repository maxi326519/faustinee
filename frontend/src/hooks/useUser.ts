import { useCallback } from "react";
import { User } from "@/interfaces/User";
import useUserStore from "@/stores/usersStore";
import useLoading from "./useLoading";
import axios from "axios";
import Swal from "sweetalert2";

export function useUsers() {
  const loading = useLoading();
  const users = useUserStore();

  const fetchUsers = useCallback(async () => {
    try {
      loading.open();
      console.log(
        "Obteniendo usuarios",
        sessionStorage.getItem("token"),
        axios.defaults.headers.common["Authorization"]
      );
      const response = await axios.get("/users");
      if (!Array.isArray(response.data)) throw new Error("Invalid response");
      users.set(response.data);
      loading.close();
    } catch (error) {
      loading.close();
      console.error("Failed to fetch users:", error);
    }
  }, []);

  const createUser = async (user: User) => {
    try {
      loading.open();
      const response = await axios.post("/users", user);
      users.add(response.data);
      Swal.fire({
        title: "Creado",
        text: "Se creó el usuario con éxito",
        icon: "success",
      });
      loading.close();
    } catch (error) {
      loading.close();
      Swal.fire({
        title: "Error",
        text: "Hubo un error inesperado al crear el usuario",
        icon: "error",
      });
      console.error("Failed to create user:", error);
    }
  };

  const updateUser = async (user: User) => {
    try {
      loading.open();
      const response = await axios.put(`/users/${user.id}`, user);
      users.update(response.data);
      Swal.fire({
        title: "Actualizado",
        text: `Se actualizó el usuario ${user.name} con éxito`,
        icon: "success",
      });
      loading.close();
    } catch (error) {
      loading.close();
      Swal.fire({
        title: "Error",
        text: "Hubo un error inesperado al actualizar el usuario",
        icon: "error",
      });
      console.error("Failed to update user:", error);
    }
  };

  const deleteUserById = async (userId: string) => {
    try {
      loading.open();
      await axios.delete(`/users/${userId}`);
      users.delete(userId);
      Swal.fire({
        title: "Eliminado",
        text: "Se eliminó el usuario con éxito",
        icon: "success",
      });
      loading.close();
    } catch (error) {
      loading.close();
      Swal.fire({
        title: "Error",
        text: "Hubo un error inesperado al eliminar el usuario",
        icon: "error",
      });
      console.error("Failed to delete user:", error);
    }
  };

  const changePassword = async (
    id: string,
    email: string,
    oldPassword: string,
    newPassword: string
  ) => {
    try {
      await axios.put(`/users/forget-password/${id}`, {
        email,
        oldPassword,
        newPassword,
      });
      Swal.fire({
        title: "Actualizado",
        text: "Se actualizó la contraseña con éxito",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un error inesperado al actualizar la contraseña",
        icon: "error",
      });
      console.error("Failed to update password:", error);
    }
  };

  return {
    get: fetchUsers,
    create: createUser,
    update: updateUser,
    deleteById: deleteUserById,
    changePassword,
  };
}
