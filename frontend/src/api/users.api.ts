import type { User } from "../types/User";

const API_URL = "http://localhost:9000/api/users";

export const getUsers = async (
  page: number = 1,
  limit: number = 5,
  search: string = "",
  sortOrder: "asc" | "desc" = "asc",
  signal?: AbortSignal
): Promise<{ data: User[]; total: number }> => {
  const params = new URLSearchParams({
    _page: page.toString(),
    _limit: limit.toString(),
    _sort: "name",
    _order: sortOrder,
  });

  if (search) {
    params.append("q", search);
  }

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    signal,
  });

  if (!response.ok) {
  const errorText = await response.text();
  throw new Error(errorText || "Error al obtener usuarios");
}

  const data = await response.json();
  const total = Number(response.headers.get("X-Total-Count") || 0);

  return { data, total };
};
export const createUser = async (data: {
  name: string;
  description: string;
  photo: string;
}) => {
  const response = await fetch("http://localhost:9000/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al crear usuario");
  }

  return response.json();
};
export const deleteUser = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar usuario");
  }

  return true;
};
export const getUserById = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Error al obtener usuario");
  }

  return response.json();
};
