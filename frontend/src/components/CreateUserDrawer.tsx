import { Drawer, Form, Input, Button, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { createUser } from "../api/users.api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateUserDrawer = ({
  open,
  onClose,
  onSuccess,
}: Props) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      setSubmitting(true);

      await createUser({
        name: values.firstName,
        description: values.description,
        photo: values.photo,
      });

      message.success("Usuario creado correctamente");

      onSuccess();
      onClose(); 

    } catch {
      message.error("Error al crear usuario");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      open={open}
      width={520}
      closable={false}
      onClose={onClose}
      destroyOnClose
      bodyStyle={{ padding: 24 }}
      headerStyle={{ padding: "16px 24px" }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingRight: 8,
          }}
        >
          {/* IZQUIERDA */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CloseOutlined
              onClick={onClose}
              style={{ cursor: "pointer", fontSize: 16 }}
            />
            <span style={{ fontWeight: 500, fontSize: 16 }}>
              Agregar nuevo Contacto
            </span>
          </div>

          {/* DERECHA */}
          <div style={{ display: "flex", gap: 12 }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              type="primary"
              loading={submitting}
              onClick={handleSubmit}
            >
              Guardar
            </Button>
          </div>
        </div>
      }
    >
      {/* Texto obligatorio */}
      <div
        style={{
          textAlign: "right",
          fontSize: 12,
          color: "#8c8c8c",
          padding: "8px 24px 0 24px",
        }}
      >
        * Campo obligatorio
      </div>

      <Form
        layout="vertical"
        form={form}
        labelCol={{ style: { fontWeight: 500 } }}
      >
        <Form.Item
          label="URL imagen de Perfil"
          name="photo"
          rules={[{ required: true, message: "Ingrese la URL de la imagen" }]}
        >
          <Input placeholder="Inserte la URL de la imagen de perfil" />
        </Form.Item>

        <Form.Item
          label="Nombre"
          name="firstName"
          rules={[{ required: true, message: "Ingrese el nombre" }]}
        >
          <Input placeholder="Escriba el nombre de contacto" />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="description"
          rules={[{ required: true, message: "Ingrese la descripción" }]}
        >
          <Input placeholder="Agregue la descripción del contacto" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};