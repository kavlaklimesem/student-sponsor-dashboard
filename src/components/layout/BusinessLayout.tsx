
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import NotificationCenter from "../NotificationCenter";

const BusinessLayout = () => {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("Örnek İşletme A.Ş.");

  const handleLogout = () => {
    navigate("/login");
  };

  useEffect(() => {
    // İşletme adını local storage veya sessionStorage'dan alabiliriz
    const storedName = sessionStorage.getItem("businessName");
    if (storedName) {
      setBusinessName(storedName);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      {/* Top Bar */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary flex-center">
              <span className="text-white font-bold text-sm">İ</span>
            </div>
            <h1 className="font-semibold text-lg sm:block hidden">{businessName}</h1>
            <h1 className="font-semibold text-lg sm:hidden">İşletme Panel</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary transition-colors text-destructive"
            >
              <LogOut className="w-5 h-5" />
              <span className="sm:inline hidden">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; 2023 Öğrenci Devlet Desteği Sistemi
        </div>
      </footer>
    </div>
  );
};

export default BusinessLayout;
