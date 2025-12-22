import { Toaster } from "sonner";

function App() {
  return (
    <>
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
