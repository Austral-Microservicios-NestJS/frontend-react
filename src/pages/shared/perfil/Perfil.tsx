import { useAuthStore } from "@/store/auth.store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  User,
  Mail,
  Shield,
  Phone,
  MapPin,
  Key,
  Save,
  Eye,
  EyeOff,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import { api } from "@/config/api-client";
import { recordatorioApi } from "@/services/recordatorio.service";

export default function Perfil() {
  const { user } = useAuthStore();

  // --- Datos de contacto editables (trae info del backend) ---
  const { data: infoAgente, refetch } = recordatorioApi.useInfoAgente(user?.idUsuario);

  const [telefono, setTelefono] = useState("");
  const [telefonoEmpresarial, setTelefonoEmpresarial] = useState("");
  const [direccion, setDireccion] = useState("");
  const [savingPerfil, setSavingPerfil] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (infoAgente) {
      setTelefono(infoAgente.telefono || "");
      setTelefonoEmpresarial(infoAgente.telefonoEmpresarial || "");
      setDireccion((infoAgente as any).direccion || "");
      setDirty(false);
    }
  }, [infoAgente]);

  const handleGuardarContacto = async () => {
    setSavingPerfil(true);
    try {
      await api.patch("/usuarios/me", {
        telefono: telefono.trim() || undefined,
        telefonoEmpresarial: telefonoEmpresarial.trim() || undefined,
        direccion: direccion.trim() || undefined,
      });
      toast.success("Datos de contacto actualizados");
      setDirty(false);
      refetch();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Error al guardar");
    } finally {
      setSavingPerfil(false);
    }
  };

  // --- Cambio de contraseña ---
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setSavingPwd(true);
    try {
      await api.patch("/usuarios/me", { contrasena: newPassword });
      toast.success("Contraseña actualizada");
      setShowPasswordForm(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Error al actualizar contraseña");
    } finally {
      setSavingPwd(false);
    }
  };

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
  const nombreCompleto = infoAgente?.nombreCompleto || user?.nombreUsuario || "";

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>

      {/* ─── CARD IDENTIDAD ──────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100 flex items-center gap-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            style={{ backgroundColor: "var(--austral-azul)" }}
          >
            {nombreCompleto.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{nombreCompleto}</h2>
            <p className="text-sm text-gray-500">{user?.correo}</p>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 mt-1.5 text-xs font-semibold rounded-full border ${
                rolColor[rol] || "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              <Shield className="w-3 h-3" />
              {rolLabel[rol] || rol}
            </span>
          </div>
        </div>

        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow icon={<User />} label="Usuario" value={user?.nombreUsuario} />
          <InfoRow icon={<Mail />} label="Correo institucional" value={user?.correo} />
          <InfoRow icon={<Briefcase />} label="Rol" value={rolLabel[rol] || rol} />
          <InfoRow icon={<Shield />} label="ID" value={user?.idUsuario?.substring(0, 13) + "..."} />
        </div>
      </div>

      {/* ─── CARD CONTACTO EDITABLE ──────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-blue-50/50 border-b border-blue-100 flex items-center gap-2">
          <Phone className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
            Datos de contacto
          </h3>
          <span className="ml-auto text-xs text-gray-500">
            Tu teléfono empresarial es lo que ve el cliente en sus leads
          </span>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Teléfono personal" icon={<Phone className="w-4 h-4 text-gray-400" />}>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => { setTelefono(e.target.value); setDirty(true); }}
                placeholder="Ej: 912543678"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
              />
            </FormField>

            <FormField
              label="Teléfono empresarial"
              hint="Visible al cliente en el detalle del lead"
              icon={<Phone className="w-4 h-4 text-blue-500" />}
            >
              <input
                type="tel"
                value={telefonoEmpresarial}
                onChange={(e) => { setTelefonoEmpresarial(e.target.value); setDirty(true); }}
                placeholder="Ej: 987654321"
                className="w-full border border-blue-200 bg-blue-50/30 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
              />
            </FormField>
          </div>

          <FormField label="Dirección" icon={<MapPin className="w-4 h-4 text-gray-400" />}>
            <input
              type="text"
              value={direccion}
              onChange={(e) => { setDireccion(e.target.value); setDirty(true); }}
              placeholder="Ej: Av. Javier Prado 123, San Isidro"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
            />
          </FormField>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGuardarContacto}
              disabled={!dirty || savingPerfil}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: "var(--austral-azul)" }}
            >
              {savingPerfil ? <Save className="w-4 h-4 animate-pulse" /> : <CheckCircle className="w-4 h-4" />}
              {savingPerfil ? "Guardando..." : "Guardar cambios"}
            </button>
            {dirty && !savingPerfil && (
              <span className="text-xs text-amber-600">Cambios sin guardar</span>
            )}
          </div>
        </div>
      </div>

      {/* ─── CARD SEGURIDAD ──────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
          <Key className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Seguridad</h3>
        </div>
        <div className="px-6 py-5">
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <Key className="w-4 h-4" />
              Cambiar contraseña
            </button>
          ) : (
            <div className="space-y-3 max-w-md">
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Nueva contraseña (mínimo 6 caracteres)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleChangePassword}
                  disabled={savingPwd}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50"
                  style={{ backgroundColor: "var(--austral-azul)" }}
                >
                  <Save className="w-4 h-4" />
                  {savingPwd ? "Guardando..." : "Guardar"}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
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

// ─── Helpers ──────────────────
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
      <div className="text-gray-400">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

function FormField({
  label,
  icon,
  hint,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
        {icon}
        {label}
        {hint && <span className="font-normal text-gray-500">· {hint}</span>}
      </label>
      {children}
    </div>
  );
}
