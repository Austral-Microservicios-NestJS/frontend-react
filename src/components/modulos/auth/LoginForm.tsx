

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.services";
import { Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface LoginFormData {
  correo: string;
  contrasena: string;
  recordarme: boolean;
}

export default function LoginForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login: storeLogin, isLoading, setLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      correo: "",
      contrasena: "",
      recordarme: false,
    },
  });

  // Verificar si el token expiró
  useEffect(() => {
    const expired = searchParams.get("expired");
    const from = searchParams.get("from");

    if (expired === "true") {
      toast.error("Tu sesión ha expirado", {
        description: "Por favor, inicia sesión nuevamente",
      });
    }

    if (from) {
      toast.info("Debes iniciar sesión para acceder a esta página");
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await authService.login({
        correo: data.correo,
        contrasena: data.contrasena,
      });
      
      // Assume response contains user and token
      if (response && response.token && response.user) {
         storeLogin(response.user, response.token);
         navigate("/dashboard");
      } else {
         throw new Error("Respuesta inválida del servidor");
      }

    } catch (error: any) {
      console.error("Error en login:", error);
      toast.error("Error al iniciar sesión", {
        description:
          error.response?.data?.message || error.message || "Error desconocido",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      {/* Card Container con fondo semitransparente en mobile */}
      <div className="lg:bg-background bg-transparent lg:rounded-none p-6 sm:p-8 lg:p-0 lg:shadow-none lg:border-0">
        <div className="text-center mb-8 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 hidden lg:block"
          >
            <img
              src="/images/logonew.png"
              alt="Austral Seguros Logo"
              width={200}
              height={80}
              className="h-auto w-auto"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:text-muted-foreground text-zinc-300"
          >
            Ingresa tus credenciales para acceder al sistema
          </motion.p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campo Usuario/Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-2"
          >
            <Label
              htmlFor="usuario"
              className="text-base font-medium lg:text-foreground text-white"
            >
              Usuario o Email
            </Label>
            <Input
              id="usuario"
              type="text"
              placeholder="admin@austral.com"
              className="h-12 lg:bg-muted/30 bg-white/10 lg:backdrop-blur-none backdrop-blur-sm lg:border-input/60 border-white/20 focus:bg-background lg:text-foreground text-white placeholder:text-zinc-400 transition-all duration-300"
              {...register("correo")}
              autoComplete="username"
              disabled={isLoading}
            />
            {errors.correo && (
              <div className="flex items-center gap-1 text-sm lg:text-destructive text-red-300 animate-in slide-in-from-left-1 fade-in">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.correo.message}</span>
              </div>
            )}
          </motion.div>

          {/* Campo Contraseña */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-2"
          >
            <Label
              htmlFor="contrasena"
              className="text-base font-medium lg:text-foreground text-white"
            >
              Contraseña
            </Label>
            <div className="relative group">
              <Input
                id="contrasena"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-12 pr-10 lg:bg-muted/30 bg-white/10 lg:backdrop-blur-none backdrop-blur-sm lg:border-input/60 border-white/20 focus:bg-background lg:text-foreground text-white placeholder:text-zinc-400 transition-all duration-300"
                {...register("contrasena")}
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 lg:text-muted-foreground text-zinc-300 lg:hover:text-foreground hover:text-white transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.contrasena && (
              <div className="flex items-center gap-1 text-sm lg:text-destructive text-red-300 animate-in slide-in-from-left-1 fade-in">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.contrasena.message}</span>
              </div>
            )}
          </motion.div>

          {/* Recordarme y Olvidé contraseña */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recordarme"
                checked={rememberMe}
                onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                disabled={isLoading}
                className="lg:border-input border-white/30"
              />
              <label
                htmlFor="recordarme"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none lg:text-foreground text-white"
              >
                Recordarme
              </label>
            </div>
              <Link
                to="/forgot-password"
              className="text-sm lg:text-primary text-zinc-300 lg:hover:text-primary/80 hover:text-white hover:underline transition-colors"
              tabIndex={isLoading ? -1 : 0}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </motion.div>

          {/* Botón de envío */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}
