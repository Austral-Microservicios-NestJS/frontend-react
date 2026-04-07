import { useAuthStore } from "@/store/auth.store";
import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Shield, Calendar, Key, Save, Eye, EyeOff } from "lucide-react";
import { api } from "@/config/api-client";

export default function Perfil() {
  const { user } = useAuthStore();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const rolLabel: Record<string, string> = {
    ADMINISTRADOR: "Administrador",
    EJECUTIVO_CUENTA: "Ejecutivo de Cuenta",
    BROKER: "Broker",
    PROMOTOR_VENTA: "Promotor de Venta",
    REFERENCIADOR: "Referenciador",
    PUNTO_VENTA: "Punto de Venta",
  };

  const rolColor: Record<string, string> = {
    ADMINISTRADOR: "bg-red-100 text-red-700 border-red-200",
    EJECUTIVO_CUENTA: "bg-blue-100 text-blue-700 border-blue-200",
    BROKER: "bg-purple-100 text-purple-700 border-purple-200",
    PROMOTOR_VENTA: "bg-amber-100 text-amber-700 border-amber-200",
    REFERENCIADOR: "bg-teal-100 text-teal-700 border-teal-200",
    PUNTO_VENTA: "bg-indigo-100 text-indigo-700 border-indigo-200",
  };

  const rol = user?.rol?.nombreRol || "";

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("La nueva contrasena debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Las contrasenas no coinciden");
      return;
    }
    setSaving(true);
    try {
      await api.patch(`/usuarios/${user?.idUsuario}`, {
        contrasena: newPassword,
      });
      toast.success("Contrasena actualizada correctamente");
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Error al actualizar la contrasena");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

      {/* Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header con avatar */}
        <div className="px-6 py-8 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: "var(--austral-azul)" }}
            >
              {user?.nombreUsuario?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user?.nombreUsuario}
              </h2>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 mt-1 text-xs font-semibold rounded-full border ${
                  rolColor[rol] || "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                <Shield className="w-3 h-3" />
                {rolLabel[rol] || rol}
              </span>
            </div>
          </div>
        </div>

        {/* Datos */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Nombre de usuario</p>
                <p className="text-sm font-medium text-gray-800">
                  {user?.nombreUsuario}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Correo</p>
                <p className="text-sm font-medium text-gray-800">
                  {user?.correo}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
              <Shield className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Rol</p>
                <p className="text-sm font-medium text-gray-800">
                  {rolLabel[rol] || rol}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">ID Usuario</p>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {user?.idUsuario?.substring(0, 8)}...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cambiar contrasena */}
        <div className="px-6 py-5 border-t border-gray-100">
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Key className="w-4 h-4" />
              Cambiar contrasena
            </button>
          ) : (
            <div className="space-y-3 max-w-sm">
              <h3 className="text-sm font-semibold text-gray-800">
                Cambiar contrasena
              </h3>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Contrasena actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  {showCurrent ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Nueva contrasena"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  {showNew ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <input
                type="password"
                placeholder="Confirmar nueva contrasena"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "var(--austral-azul)" }}
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Guardando..." : "Guardar"}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
