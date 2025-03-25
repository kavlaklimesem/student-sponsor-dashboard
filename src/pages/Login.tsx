
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building, ChevronDown, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Örnek işletme listesi
const businessList = [
  { id: "1", name: "ABC Teknoloji A.Ş." },
  { id: "2", name: "XYZ Mühendislik Ltd. Şti." },
  { id: "3", name: "Yıldız Bilişim Hizmetleri" },
  { id: "4", name: "Merkez Yazılım Danışmanlık" },
  { id: "5", name: "Akış Teknoloji Sistemleri" },
];

const Login = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<{ id: string; name: string } | null>(null);
  const [taxNumber, setTaxNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<"business" | "admin">("business");

  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectBusiness = (business: { id: string; name: string }) => {
    setSelectedBusiness(business);
    setIsDropdownOpen(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginType === "business" && !selectedBusiness) {
      toast({
        title: "Hata",
        description: "Lütfen bir işletme seçin.",
        variant: "destructive",
      });
      return;
    }

    if (!taxNumber.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen vergi numarası girin.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      
      if (loginType === "admin") {
        if (taxNumber === "admin123") {
          // Başarılı admin girişi
          navigate("/admin/ogrenci-yukleme");
          
          toast({
            title: "Giriş Başarılı",
            description: "Admin paneline yönlendiriliyorsunuz.",
          });
        } else {
          // Başarısız admin girişi
          toast({
            title: "Giriş Başarısız",
            description: "Geçersiz admin şifresi.",
            variant: "destructive",
          });
        }
      } else {
        // İşletme girişi
        if (taxNumber.length >= 5) {
          // Örnek işletme bilgisini session storage'a kaydedelim
          if (selectedBusiness) {
            sessionStorage.setItem("businessName", selectedBusiness.name);
          }
          
          // Başarılı işletme girişi
          navigate("/business/ogrenci-listesi");
          
          toast({
            title: "Giriş Başarılı",
            description: "İşletme paneline yönlendiriliyorsunuz.",
          });
        } else {
          // Başarısız işletme girişi
          toast({
            title: "Giriş Başarısız",
            description: "Geçersiz vergi numarası.",
            variant: "destructive",
          });
        }
      }
    }, 1000);
  };

  // Belirli yükseklikte yarı saydam dalga animasyonu için
  const waveHeight = 180;

  return (
    <div className="min-h-screen overflow-hidden flex flex-col relative bg-secondary/30">
      {/* Header Wave */}
      <div
        className="absolute top-0 left-0 right-0 h-[200px] bg-primary rounded-b-[40%] z-0"
        style={{
          borderBottomLeftRadius: "50% 20%",
          borderBottomRightRadius: "50% 20%",
        }}
      ></div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col z-10">
        <header className="container mx-auto py-8 px-4 text-center">
          <h1 className="text-3xl font-bold text-white">Öğrenci Devlet Desteği</h1>
          <p className="text-primary-foreground/80 mt-2">
            İşletme veya admin olarak giriş yapın
          </p>
        </header>

        <main className="flex-1 container mx-auto flex items-center justify-center px-4 pb-12">
          <div className="glass-card w-full max-w-md p-8 shadow-xl animate-fade-in">
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex-center text-primary">
                <LogIn size={32} />
              </div>
            </div>

            <div className="flex gap-2 mb-8 bg-secondary rounded-lg p-1">
              <button
                className={`flex-1 py-2 rounded-md transition-colors ${
                  loginType === "business"
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setLoginType("business")}
              >
                İşletme Girişi
              </button>
              <button
                className={`flex-1 py-2 rounded-md transition-colors ${
                  loginType === "admin"
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setLoginType("admin")}
              >
                Admin Girişi
              </button>
            </div>

            <form onSubmit={handleLogin}>
              {loginType === "business" && (
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-1">İşletme Seçin</label>
                  <div className="relative">
                    <button
                      type="button"
                      className="input-field w-full text-left flex items-center justify-between"
                      onClick={toggleDropdown}
                    >
                      {selectedBusiness ? (
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex-center text-primary mr-2">
                            <Building size={14} />
                          </div>
                          <span>{selectedBusiness.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">İşletme seçin...</span>
                      )}
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute z-20 mt-1 w-full bg-white rounded-lg border shadow-lg max-h-60 overflow-auto">
                        {businessList.map((business) => (
                          <button
                            key={business.id}
                            type="button"
                            className="w-full text-left px-4 py-3 hover:bg-secondary flex items-center gap-2 transition-colors"
                            onClick={() => selectBusiness(business)}
                          >
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex-center text-primary">
                              <Building size={14} />
                            </div>
                            <span>{business.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  {loginType === "business" ? "Vergi Numarası" : "Admin Şifresi"}
                </label>
                <input
                  type={loginType === "admin" ? "password" : "text"}
                  className="input-field w-full"
                  placeholder={
                    loginType === "business" ? "1234567890" : "••••••••"
                  }
                  value={taxNumber}
                  onChange={(e) => setTaxNumber(e.target.value)}
                />
                {loginType === "admin" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Demo için şifre: admin123
                  </p>
                )}
              </div>

              <button
                type="submit"
                className={cn(
                  "w-full bg-primary text-white py-3 rounded-xl font-medium button-hover relative overflow-hidden flex-center",
                  loading ? "bg-primary/80" : ""
                )}
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <LogIn size={18} className="mr-2" />
                    <span>Giriş Yap</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>

      {/* Footer Wave */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[80px] bg-primary rounded-t-[40%] z-0"
        style={{
          borderTopLeftRadius: "50% 70%",
          borderTopRightRadius: "50% 70%",
        }}
      ></div>
    </div>
  );
};

export default Login;
