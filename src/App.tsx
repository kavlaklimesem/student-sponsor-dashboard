
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Admin Sayfaları
import AdminLayout from "./components/layout/AdminLayout";
import OgrenciYukleme from "./pages/admin/OgrenciYukleme";
import IsletmeYonetimi from "./pages/admin/IsletmeYonetimi";
import DekontInceleme from "./pages/admin/DekontInceleme";

// İşletme Sayfaları
import BusinessLayout from "./components/layout/BusinessLayout";
import OgrenciListesi from "./pages/business/OgrenciListesi";

// Giriş ve Hata Sayfaları
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Giriş sayfasını ana sayfa olarak ayarla */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Paneli Rotaları */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="ogrenci-yukleme" replace />} />
            <Route path="ogrenci-yukleme" element={<OgrenciYukleme />} />
            <Route path="isletme-yonetimi" element={<IsletmeYonetimi />} />
            <Route path="dekont-inceleme" element={<DekontInceleme />} />
          </Route>

          {/* İşletme Paneli Rotaları */}
          <Route path="/business" element={<BusinessLayout />}>
            <Route index element={<Navigate to="ogrenci-listesi" replace />} />
            <Route path="ogrenci-listesi" element={<OgrenciListesi />} />
          </Route>

          {/* 404 - Sayfa Bulunamadı */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
