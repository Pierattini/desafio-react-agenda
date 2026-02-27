import { Avatar, Button, Popconfirm } from "antd";
import type { User } from "../types/User";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";

interface Props {
  user: User;
  onDelete?: (id: number) => void;
}

export const UserCard = ({ user, onDelete }: Props) => {

 return (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "280px 1fr 80px",
      columnGap: 32,
      alignItems: "flex-start",
      padding: "18px 16px",
      borderBottom: "1px solid #f0f0f0",
    }}
  >
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
      <Avatar
  size={36}
  icon={<UserOutlined />}
  style={{
    backgroundColor: "#f0f0f0",
    color: "#8c8c8c"
  }}
/>

      <span
  style={{
    color: "#1677ff",
    fontWeight: 500,
    fontSize: 14,
  }}
>
  {user.name}
</span>
    </div>
    <div
      style={{
        color: "#595959",
        fontSize: 14,
        lineHeight: 1.5,
        marginLeft: -68,
      }}
    >
      {user.description}
    </div>
    <div style={{ textAlign: "center" }}>
      <Popconfirm
        title="¿Eliminar contacto?"
        description="Esta acción no se puede deshacer"
        okText="Eliminar"
        cancelText="Cancelar"
        okButtonProps={{ type: "primary" }}
        onConfirm={() => onDelete?.(user.id)}
      >
        <Button
          type="text"
          icon={<DeleteOutlined />}
          style={{
            color: "#8c8c8c",
            fontSize: 16,
          }}
        />
      </Popconfirm>
    </div>
  </div>
);}