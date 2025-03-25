
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Hatası: Kullanıcı olmayan bir sayfaya erişmeye çalıştı:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <div className="glass-card p-8 max-w-md w-full text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex-center text-destructive mb-6">
          <AlertTriangle size={32} />
        </div>
        
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Aradığınız sayfa bulunamadı
        </p>
        
        <Link
          to="/login"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg button-hover"
        >
          <ArrowLeft size={18} />
          <span>Giriş Sayfasına Dön</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
