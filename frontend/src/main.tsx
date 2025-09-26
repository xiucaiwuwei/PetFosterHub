import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import App from "./app/App.tsx";
import "./index.css";

import { CartProvider } from '@/lib/contexts/cartContext';
import { CartSidebar } from '@/components/CartSidebar';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
        <CartSidebar />
        <Toaster />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
)
