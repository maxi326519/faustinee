import { useState, useEffect, useMemo, useCallback } from "react";
import { SquarePlus, Pencil, Trash } from "lucide-react";
import { User, UserRol } from "@/interfaces/User";
import { useUsers } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/usersStore";
import Swal from "sweetalert2";
import Layout from "@/components/Dashboard/Layout";
import SearchFilter from "@/components/Dashboard/SearchFilter";
import PaginatedTable from "@/components/Dashboard/PaginatedTable";
import UserForm from "@/components/Dashboard/Forms/UserForm";
import EditEntityForm from "@/components/Dashboard/Forms/EditEntityForm";

const ITEMS_PER_PAGE = 10;

export default function UsersTable() {
  const { data } = useUserStore();
  const { get: fetchUsers, deleteById, create, update } = useUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRol>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isEditUserFormOpen, setIsEditUserFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filterUsers = useCallback(
    (roleFilter: "all" | UserRol, search: string) => {
      return data.filter((user) => {
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesSearch = user.name
          .toLowerCase()
          .includes(search.toLowerCase());
        return matchesRole && matchesSearch;
      });
    },
    [data]
  );

  const filteredUsers = useMemo(() => filterUsers(roleFilter, search), [
    roleFilter,
    search,
    filterUsers,
  ]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handleAddUser = useCallback(
    (newUser: User) => {
      create(newUser);
      setIsUserFormOpen(false);
      setSearch("");
      setRoleFilter("all");
    },
    [create]
  );

  useCallback(
    (updatedUser: User) => {
      update(updatedUser);
      setIsEditUserFormOpen(false);
      setSelectedUser(null);
      fetchUsers();
    },
    [update]
  );

  const handleEditUser = async (user: User) => {
    try {
      // console.log("user", user);
      await update(user);
      setIsEditUserFormOpen(false);
      setSelectedUser(null);
      setSearch("");
      setRoleFilter("all");
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
      Swal.fire("Error", "No se pudo actualizar el usuario.", "error");
    }
  };

  const handleDeleteUser = useCallback(
    async (user: User) => {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        html: `El usuario <b>${user.name}</b> será eliminado.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        try {
          await deleteById(user.id!);
          Swal.fire(
            "¡Eliminado!",
            `El usuario ${user.name} ha sido eliminado.`,
            "success"
          );
        } catch (error) {
          console.log(error);
          Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
        }
      }
    },
    [deleteById]
  );

  const handleOpenEditModal = useCallback((user: User) => {
    setSelectedUser(user);
    setIsEditUserFormOpen(true);
  }, []);

  const userColumns = useMemo(
    () => [
      { key: "name" as keyof User, label: "Nombre" },
      { key: "email" as keyof User, label: "Email" },
      { key: "role" as keyof User, label: "Rol" },
      {
        key: "acciones" as keyof User,
        label: "Acciones",
        render: (user: User) => (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                handleOpenEditModal(user);
                setIsEditUserFormOpen(true);
              }}
            >
              <Pencil />
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteUser(user)}
            >
              <Trash />
            </Button>
          </div>
        ),
      },
    ],
    [handleDeleteUser, handleOpenEditModal]
  );

  const userFieldsConfig = [
    {
      name: "name", // Coincide con la propiedad "name" de User
      label: "Nombre",
      type: "text",
      placeholder: "Ingrese el nombre",
    },
    {
      name: "email", // Coincide con la propiedad "email" de User
      label: "Correo electrónico",
      type: "email",
      placeholder: "Ingrese el correo electrónico",
    },
    {
      name: "password", // Coincide con la propiedad "password" de User
      label: "Contraseña",
      type: "password",
      placeholder: "Ingrese la contraseña",
    },
    {
      name: "role", // Coincide con la propiedad "role" de User
      label: "Rol",
      type: "select",
      options: Object.values(UserRol).map((role) => ({
        value: role,
        label: role,
      })),
    },
  ];

  useEffect(() => {
    if (fetchUsers) {
      fetchUsers();
    }
  }, []);

  return (
    <Layout>
      <div className="p-6 space-y-4">
        <UserForm
          isOpen={isUserFormOpen}
          onClose={() => setIsUserFormOpen(false)}
          onSubmit={handleAddUser}
        />

        {selectedUser && (
          <EditEntityForm
            isOpen={isEditUserFormOpen}
            onClose={() => {
              setIsEditUserFormOpen(false);
              setSelectedUser(null);
            }}
            onSubmit={handleEditUser}
            fields={userFieldsConfig}
            initialData={selectedUser}
            title="Editar Usuario"
          />
        )}

        <h1 className="text-2xl font-bold">User</h1>
        <div className="flex gap-4 justify-between">
          <SearchFilter
            search={search}
            setSearch={setSearch}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            placeholder="Buscar usuario..."
          />
          <Button
            onClick={() => setIsUserFormOpen(true)}
            className="bg-primary text-white dark:bg-primary-dark dark:text-black"
          >
            <SquarePlus />
            Nuevo
          </Button>
        </div>
        <PaginatedTable
          data={paginatedUsers}
          columns={userColumns}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Layout>
  );
}
