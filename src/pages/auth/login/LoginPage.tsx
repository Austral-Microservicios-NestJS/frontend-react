import LoginForm from "@/components/modules/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full relative">
      {/* Background Image for Mobile - Full Screen with Overlay */}
      <div className="absolute inset-0 lg:hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/85 via-zinc-900/90 to-zinc-900/95" />
      </div>

      {/* Left Side - Hero/Branding (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 bg-zinc-600 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-70 mix-blend-overlay" />
        <div className="relative z-10 p-12 text-white max-w-xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Austral Corredores de Seguros
            </h1>
            <p className="text-lg text-zinc-300 leading-relaxed">
              Gestión integral y eficiente. Accede a tu panel de control para
              administrar pólizas, clientes y más.
            </p>
          </div>
          <div className="flex gap-4 text-sm text-zinc-400">
            <span>© {new Date().getFullYear()} Austral Seguros</span>
            <span>•</span>
            <span>Privacidad y Seguridad</span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-zinc-900/90" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:bg-background relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo/Branding */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Austral Seguros
            </h1>
            <p className="text-sm text-zinc-300">Gestión integral de seguros</p>
          </div>

          <LoginForm />

          {/* Mobile Footer */}
          <div className="lg:hidden text-center text-xs text-zinc-400 mt-8">
            <p>© {new Date().getFullYear()} Austral Corredores de Seguros</p>
          </div>
        </div>
      </div>
    </div>
  );
}
