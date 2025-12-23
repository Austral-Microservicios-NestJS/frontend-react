import { Toaster } from "sonner";
import { RouterProvider } from "react-router-dom";
import router from "@/routes/routes";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
        expand={true}
      />
    </>
  );
}

export default App;
