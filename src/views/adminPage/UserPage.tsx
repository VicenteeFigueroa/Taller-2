"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ApiBackend } from "@/clients/axios";

import { User } from "@/interfaces/User";

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    startDate: "",
  });

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Verificación token y rol admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userRaw);
    if (user.role !== "Admin") {
      router.push("/");
      return;
    }

    fetchUsers();
  }, [pageNumber, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const params = new URLSearchParams();

      if (filters.search) params.append("searchTerm", filters.search);
      if (filters.status === "active") params.append("isActive", "true");
      else if (filters.status === "inactive")
        params.append("isActive", "false");
      if (filters.startDate) params.append("registeredFrom", filters.startDate);
      params.append("pageNumber", pageNumber.toString());
      params.append("pageSize", pageSize.toString());
      params.append("orderBy", "registeredDesc");

      const response = await ApiBackend.get(`/user?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setUsers([]);
    }
    setLoading(false);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPageNumber(1);
  };

  const renderStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default">Activo</Badge>
    ) : (
      <Badge variant="destructive">Inactivo</Badge>
    );
  };

  const openUserDialog = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header fijo */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-center">
            Usuarios registrados
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        {/* FILTROS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Input
            placeholder="Buscar por nombre o email"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />

          <Select
            value={filters.status}
            onValueChange={(v) => handleFilterChange("status", v)}
          >
            <SelectTrigger>
              <SelectValue>
                {filters.status === "all"
                  ? "Todos los estados"
                  : filters.status === "active"
                    ? "Activo"
                    : "Inactivo"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            placeholder="Fecha de registro"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
          />
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>
                      {user.firtsName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{renderStatusBadge(user.isActive)}</TableCell>
                    <TableCell>
                      {new Date(user.registeredAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => openUserDialog(user)}>
                        Ver perfil
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* PAGINACIÓN */}
        <div className="flex justify-center mt-6 space-x-2">
          <Button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4">Página {pageNumber}</span>
          <Button
            disabled={users.length < pageSize}
            onClick={() => setPageNumber((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>

        {/* MODAL PERFIL */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Perfil de usuario</DialogTitle>
              <DialogDescription>
                Detalles completos del usuario seleccionado
              </DialogDescription>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-2 mt-4">
                <p>
                  <strong>Nombre:</strong> {selectedUser.firtsName}{" "}
                  {selectedUser.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {renderStatusBadge(selectedUser.isActive)}
                </p>
                <p>
                  <strong>Fecha registro:</strong>{" "}
                  {new Date(selectedUser.registeredAt).toLocaleDateString()}
                </p>
              </div>
            )}

            <DialogFooter className="mt-4">
              <Button onClick={() => setIsDialogOpen(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <footer className="bg-muted py-6 mt-12 text-center text-sm text-muted-foreground">
        © 2025 MiTienda. Todos los derechos reservados.
      </footer>
    </div>
  );
}
