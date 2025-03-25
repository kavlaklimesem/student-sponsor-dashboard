
import { Link, Outlet } from "react-router-dom";
import { FileUp, Building, CheckSquare, XSquare, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    {
      name: "Öğrenci Devlet Desteği Tablosu",
      icon: <FileUp className="w-5 h-5" />,
      path: "/admin/ogrenci-yukleme",
    },
    {
      name: "İşletme Yönetimi",
      icon: <Building className="w-5 h-5" />,
      path: "/admin/isletme-yonetimi",
    },
    {
      name: "Dekont İnceleme",
      icon: <CheckSquare className="w-5 h-5" />,
      path: "/admin/dekont-inceleme",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-secondary/30">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="font-semibold text-lg">Admin Panel</h1>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden rounded-full p-1 hover:bg-secondary"
            >
              <XSquare className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-secondary transition-colors"
              >
                <div className="text-primary">{item.icon}</div>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <Link
              to="/login"
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-secondary transition-colors text-destructive"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Çıkış Yap</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4">
          {!isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-secondary mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
          <h1 className="text-xl font-semibold">Öğrenci Devlet Desteği Yönetimi</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
