import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "10px",
            fontSize: "14px",
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;