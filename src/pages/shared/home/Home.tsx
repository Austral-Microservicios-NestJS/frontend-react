import { useAuthStore } from "@/store/auth.store";

const Home = () => {
  const { user } = useAuthStore();

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <h1>Bienvenido {user?.nombreUsuario || "Invitado"}</h1>
    </div>
  );
};

export default Home;
