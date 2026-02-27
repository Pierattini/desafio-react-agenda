import { useEffect, useState, useCallback } from "react";
import { getUsers } from "../api/users.api";
import type { User } from "../types/User";

export const useUsers = (
  page: number,
  pageSize: number,
  search: string,
  sortOrder: "asc" | "desc"
) => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoading(true);
        setError("");

        const response = await getUsers(page, pageSize, search, sortOrder, signal);

        setUsers(response.data);
        setTotal(response.total);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, search, sortOrder]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(controller.signal);
    return () => controller.abort();
  }, [fetchUsers]);

  const refetch = () => fetchUsers();

  return { users, total, loading, error, refetch };
};