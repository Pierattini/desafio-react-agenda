import {Typography,Alert,Input,Card,Button,Skeleton,message,Select,Pagination,} from "antd";
import { useUsers } from "../hooks/useUsers";
import { useDebounce } from "../hooks/useDebounce";
import { UserCard } from "./UserCard";
import { useSearchParams } from "react-router-dom";
import { CreateUserDrawer } from "./CreateUserDrawer";
import { useState } from "react";
import { PlusOutlined, SearchOutlined  } from "@ant-design/icons";
import { deleteUser } from "../api/users.api";

const { Title, Text } = Typography;

export const UsersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const sortOrder =
    (searchParams.get("sort") as "asc" | "desc") || "asc";

  const [drawerOpen, setDrawerOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const PAGE_SIZE = 5;
  const { users, loading, error, total, refetch } = useUsers(
  page,
  PAGE_SIZE,
  debouncedSearch,
  sortOrder
);

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      message.success("Usuario eliminado correctamente");
      refetch();
    } catch {
      message.error("Error al eliminar usuario");
    }
  };

  return (
    <div
      style={{
        padding: 40,
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Card
        style={{
          maxWidth: 900,
          margin: "0 auto",
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        {/* ERROR */}
        {error && (
          <Alert
            type="error"
            message="No se pudieron cargar los usuarios"
            description={error}
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}

        {/* HEADER */}
        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 4 }}>
            Agenda Previred - Mi agenda de contactos laboral
          </Title>

          <Text
            type="secondary"
            style={{ display: "block", marginBottom: 16 }}
          >
            Aquí podrá encontrar o buscar a todos sus contactos agregados,
            agregar nuevos contactos y eliminar contactos no deseados.
          </Text>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Agregar Contacto
          </Button>
        </div>

        {/* FILTROS */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <Input
  allowClear
  placeholder="Buscar por nombre..."
  value={search}
  suffix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
  style={{ borderRadius: 6 }}
  onChange={(e) =>
    setSearchParams({
      page: "1",
      search: e.target.value,
      sort: sortOrder,
    })
  }
/>

          <Select
            value={sortOrder}
            style={{ width: 220 }}
            onChange={(value) =>
              setSearchParams({
                page: "1",
                search,
                sort: value,
              })
            }
            options={[
              { value: "asc", label: "Nombre A → Z" },
              { value: "desc", label: "Nombre Z → A" },
            ]}
          />
        </div>

        {/* ENCABEZADO TABLA */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr 80px",
            columnGap: 24,
            padding: "18px 16px",
            backgroundColor: "#fafafa",
            borderBottom: "1px solid #f0f0f0",
            fontWeight: 600,
            fontSize: 13,
            color: "#595959",
          }}
        >
          <div>Nombre</div>
          <div>Descripción</div>
          <div style={{ textAlign: "center" }}>Acciones</div>
        </div>

        {/* FILAS */}
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                avatar
                title
                active
                style={{ padding: "16px 0" }}
              />
            ))
          : users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onDelete={handleDelete}
              />
            ))}

        {/* Estado vacío elegante (bonus UX) */}
        {!loading && users.length === 0 && (
          <div
            style={{
              padding: 24,
              textAlign: "center",
              color: "#8c8c8c",
            }}
          >
            No se encontraron resultados
          </div>
        )}

        {/* PAGINACIÓN */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Pagination
            current={page}
            pageSize={5}
            total={total}
            showSizeChanger={false}
            simple
            onChange={(newPage) =>
              setSearchParams({
                page: newPage.toString(),
                search,
                sort: sortOrder,
              })
            }
          />
        </div>
      </Card>

      {/* DRAWER */}
      <CreateUserDrawer
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  onSuccess={() => {
    setSearchParams({
      page: "1",
      search: "",
      sort: sortOrder,
    });
    refetch(); 
  }}
/>
    </div>
  );
};