import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createClient } from "@supabase/supabase-js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
      <ToastContainer theme="dark" limit={1} />
    </SessionContextProvider>
  </StrictMode>
);
