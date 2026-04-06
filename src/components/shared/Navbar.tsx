import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search, Bell, User, LogOut, ChevronDown, PanelLeft,
  Loader2, Users, ShieldCheck, TrendingUp, X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useSidebarStore } from "@/store/sidebar.store";
import { searchService, type SearchResults } from "@/services/search.service";
import { motion, AnimatePresence } from "framer-motion";
import type { Cliente, TipoPersona } from "@/types/cliente.interface";

// ─── helpers ────────────────────────────────────────────────────────────────

function clienteLabel(c: Cliente) {
  if (c.tipoPersona === ("JURIDICO" as TipoPersona)) return c.razonSocial ?? "—";
  return [c.nombres, c.apellidos].filter(Boolean).join(" ") || c.razonSocial || "—";
}

const EMPTY: SearchResults = { clientes: [], polizas: [], leads: [] };

// ─── SearchDropdown ──────────────────────────────────────────────────────────

interface DropdownProps {
  query: string;
  results: SearchResults;
  loading: boolean;
  onNavigate: (path: string) => void;
}

function SearchDropdown({ query, results, loading, onNavigate }: DropdownProps) {
  const total = results.clientes.length + results.polizas.length + results.leads.length;
  const isEmpty = !loading && total === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200/80 overflow-hidden z-50"
    >
      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2.5 px-4 py-3.5 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin text-[#003d5c]" />
          <span>Buscando <span className="font-semibold text-gray-700">"{query}"</span>…</span>
        </div>
      )}

      {/* Sin resultados */}
      {isEmpty && (
        <div className="px-4 py-5 text-center">
          <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-500">Sin resultados para <span className="text-gray-700">"{query}"</span></p>
          <p className="text-xs text-gray-400 mt-0.5">Intenta con otro nombre, número o correo</p>
        </div>
      )}

      {/* Resultados */}
      {!loading && total > 0 && (
        <div className="divide-y divide-gray-100">

          {/* Clientes */}
          {results.clientes.length > 0 && (
            <section>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50/80">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Clientes</span>
                <span className="ml-auto text-[11px] font-semibold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">
                  {results.clientes.length}
                </span>
              </div>
              {results.clientes.map((c) => (
                <button
                  key={c.idCliente}
                  onClick={() => onNavigate("/dashboard/gestion-trabajo/clientes")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50/60 transition-colors group text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-700 transition-colors">
                      {clienteLabel(c)}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{c.tipoPersona} · {c.emailNotificaciones || c.telefono1 || "Sin contacto"}</p>
                  </div>
                </button>
              ))}
            </section>
          )}

          {/* Pólizas */}
          {results.polizas.length > 0 && (
            <section>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50/80">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Pólizas</span>
                <span className="ml-auto text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                  {results.polizas.length}
                </span>
              </div>
              {results.polizas.map((p) => (
                <button
                  key={p.id ?? p.idPoliza}
                  onClick={() => onNavigate("/dashboard/gestion-trabajo/polizas")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50/60 transition-colors group text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-emerald-700 transition-colors">
                      {p.numeroPoliza}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{p.nombreAsegurado} · {p.estado}</p>
                  </div>
                </button>
              ))}
            </section>
          )}

          {/* Leads */}
          {results.leads.length > 0 && (
            <section>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50/80">
                <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Leads</span>
                <span className="ml-auto text-[11px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                  {results.leads.length}
                </span>
              </div>
              {results.leads.map((l) => (
                <button
                  key={l.idLead}
                  onClick={() => onNavigate("/dashboard/gestion-trabajo/leads")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50/60 transition-colors group text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-purple-700 transition-colors">
                      {l.nombre}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {l.empresa ? `${l.empresa} · ` : ""}{l.email ?? l.telefono ?? "Sin contacto"}
                    </p>
                  </div>
                </button>
              ))}
            </section>
          )}

          {/* Footer hint */}
          <div className="px-4 py-2 bg-gray-50/60 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">{total} resultado{total !== 1 ? "s" : ""}</span>
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-gray-200 rounded text-[10px] font-mono">Esc</kbd> para cerrar
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const navigate = useNavigate();

  // Profile dropdown
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close profile on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ⌘K / Ctrl+K focus + Escape close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Debounced search — 350ms
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(EMPTY);
      setSearchOpen(false);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    setSearchOpen(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchService.search(query.trim());
        setResults(data);
      } catch {
        setResults(EMPTY);
      } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  const handleNavigate = useCallback((path: string) => {
    setSearchOpen(false);
    setQuery("");
    navigate(path);
  }, [navigate]);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/");
  };

  const initials =
    user?.nombreUsuario?.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "U";
  const roleName = user?.rol?.nombreRol || "";

  const showDropdown = searchOpen && query.trim().length >= 2;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-gray-200/70">

      {/* ── Búsqueda centrada absolutamente ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div ref={searchRef} className="w-full max-w-sm px-4 pointer-events-auto relative">
          <div
            className={`
              flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200
              ${searchOpen || query
                ? "border-[#003d5c]/50 bg-white shadow-sm ring-2 ring-[#003d5c]/10"
                : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }
            `}
          >
            {isSearching
              ? <Loader2 className="w-4 h-4 shrink-0 text-[#003d5c] animate-spin" />
              : <Search className={`w-4 h-4 shrink-0 transition-colors duration-200 ${query ? "text-[#003d5c]" : "text-gray-400"}`} />
            }
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar clientes, pólizas, leads..."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none min-w-0"
              onFocus={() => { if (query.trim().length >= 2) setSearchOpen(true); }}
            />
            {query ? (
              <button
                onClick={() => { setQuery(""); setSearchOpen(false); inputRef.current?.focus(); }}
                className="p-0.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:flex items-center px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-200/80 rounded border border-gray-300/60 shrink-0 select-none">
                ⌘K
              </kbd>
            )}
          </div>

          {/* Dropdown de resultados */}
          <AnimatePresence>
            {showDropdown && (
              <SearchDropdown
                query={query}
                results={results}
                loading={isSearching}
                onNavigate={handleNavigate}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Left: toggle sidebar + logo ── */}
      <div className="absolute left-0 top-0 h-full flex items-center gap-2 px-4">
        <button
          onClick={toggleSidebar}
          className={`
            p-2 rounded-xl transition-all duration-200 active:scale-95
            ${isSidebarOpen
              ? "text-[#003d5c] bg-[#003d5c]/8 hover:bg-[#003d5c]/15"
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            }
          `}
          aria-label={isSidebarOpen ? "Ocultar sidebar" : "Mostrar sidebar"}
        >
          <PanelLeft className="w-4.5 h-4.5" />
        </button>
        <div className="w-px h-5 bg-gray-200 shrink-0" />
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-[#003d5c]">
            <img src="/images/logo-austral-main.png" alt="Austral" className="w-5 h-5 object-contain brightness-0 invert" />
          </div>
          <div className="hidden sm:block leading-none">
            <p className="text-sm font-bold text-gray-900">Austral</p>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Corredores</p>
          </div>
        </div>
      </div>

      {/* ── Right: bell + profile ── */}
      <div className="absolute right-0 top-0 h-full flex items-center gap-1 px-4">
        <button
          className="relative p-2.5 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 active:scale-95"
          aria-label="Notificaciones"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full ring-[1.5px] ring-white" />
        </button>

        {/* Profile */}
        <div className="relative ml-1" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen((p) => !p)}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200 active:scale-95 ${profileOpen ? "bg-gray-100" : "hover:bg-gray-100"}`}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 select-none" style={{ backgroundColor: "#003d5c" }}>
              {initials}
            </div>
            <div className="hidden md:block text-left leading-none">
              <p className="text-xs font-semibold text-gray-800 truncate max-w-24">{user?.nombreUsuario || "Usuario"}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-24">{roleName}</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 hidden md:block ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -6 }}
                transition={{ duration: 0.14, ease: [0.4, 0, 0.2, 1] }}
                className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-200/80 overflow-hidden z-50"
                role="menu"
              >
                <div className="px-4 py-3.5 border-b border-gray-100" style={{ background: "linear-gradient(135deg, #003d5c0a 0%, #003d5c18 100%)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 select-none" style={{ backgroundColor: "#003d5c" }}>
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.nombreUsuario || "Usuario"}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{user?.correo}</p>
                      <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#003d5c]/10 text-[#003d5c] uppercase tracking-wide">
                        {roleName}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-1.5" role="none">
                  <button
                    onClick={() => { navigate("/dashboard/perfil"); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                    role="menuitem"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#003d5c]/10 flex items-center justify-center transition-colors shrink-0">
                      <User className="w-4 h-4 text-gray-500 group-hover:text-[#003d5c] transition-colors" />
                    </div>
                    <span className="font-medium">Mi Perfil</span>
                  </button>
                  <div className="my-1 mx-1 h-px bg-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors group"
                    role="menuitem"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors shrink-0">
                      <LogOut className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="font-medium">Cerrar Sesión</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};
