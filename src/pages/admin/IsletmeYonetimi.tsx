
import { useState, useEffect } from "react";
import {
  Building,
  Plus,
  Search,
  Edit,
  Trash,
  X,
  Save,
  User,
  Hash,
  AtSign,
  Key,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// İşletme tipi
interface Business {
  id: string;
  name: string;
  taxNumber: string;
  email: string;
  username: string;
  logo?: string;
}

const IsletmeYonetimi = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { toast } = useToast();

  // Örnek veri
  useEffect(() => {
    // API'den işletme listesini çekmek yerine örnek veri kullanıyoruz
    const sampleBusinesses: Business[] = [
      {
        id: "1",
        name: "ABC Teknoloji A.Ş.",
        taxNumber: "1234567890",
        email: "info@abcteknoloji.com",
        username: "abcteknoloji",
      },
      {
        id: "2",
        name: "XYZ Mühendislik Ltd. Şti.",
        taxNumber: "9876543210",
        email: "iletisim@xyzmuhendislik.com",
        username: "xyzmuhendislik",
      },
      {
        id: "3",
        name: "Yıldız Bilişim Hizmetleri",
        taxNumber: "5678901234",
        email: "bilgi@yildizbilisim.com",
        username: "yildizbilisim",
      },
      {
        id: "4",
        name: "Merkez Yazılım Danışmanlık",
        taxNumber: "2345678901",
        email: "iletisim@merkezyazilim.com",
        username: "merkezyazilim",
      },
      {
        id: "5",
        name: "Akış Teknoloji Sistemleri",
        taxNumber: "3456789012",
        email: "info@akisteknoloji.com",
        username: "akisteknoloji",
      },
    ];
    setBusinesses(sampleBusinesses);
  }, []);

  const openDrawer = (business?: Business) => {
    if (business) {
      setCurrentBusiness(business);
      setIsEditing(true);
    } else {
      setCurrentBusiness({
        id: `${Date.now()}`,
        name: "",
        taxNumber: "",
        email: "",
        username: "",
      });
      setIsEditing(false);
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setCurrentBusiness(null);
  };

  const handleSave = () => {
    if (!currentBusiness) return;

    if (!currentBusiness.name || !currentBusiness.taxNumber || !currentBusiness.email) {
      toast({
        title: "Eksik bilgi",
        description: "Lütfen gerekli tüm alanları doldurun.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing) {
      // Mevcut işletmeyi güncelle
      setBusinesses((prev) =>
        prev.map((b) => (b.id === currentBusiness.id ? currentBusiness : b))
      );
      toast({
        title: "İşletme güncellendi",
        description: `${currentBusiness.name} başarıyla güncellendi.`,
      });
    } else {
      // Yeni işletme ekle
      setBusinesses((prev) => [...prev, currentBusiness]);
      toast({
        title: "İşletme eklendi",
        description: `${currentBusiness.name} başarıyla eklendi.`,
      });
    }

    closeDrawer();
  };

  const handleDelete = (id: string) => {
    const businessToDelete = businesses.find((b) => b.id === id);
    if (!businessToDelete) return;

    // Silme işlemi
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
    toast({
      title: "İşletme silindi",
      description: `${businessToDelete.name} başarıyla silindi.`,
      variant: "destructive",
    });
  };

  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (field: keyof Business, value: string) => {
    if (!currentBusiness) return;
    setCurrentBusiness({ ...currentBusiness, [field]: value });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">İşletme Yönetimi</h1>
        <p className="text-muted-foreground mt-1">
          İşletmeleri ekleyin, düzenleyin ve yönetin.
        </p>
      </div>

      {/* Üst Araç Çubuğu */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="input-field pl-10 w-full md:w-80"
            placeholder="İşletme ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => openDrawer()}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 button-hover"
        >
          <Plus size={18} />
          <span>Yeni İşletme</span>
        </button>
      </div>

      {/* İşletme Listesi */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredBusinesses.map((business) => (
          <div
            key={business.id}
            className="glass-card p-5 card-hover group"
          >
            <div className="flex justify-between">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex-center text-primary">
                <Building size={24} />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  onClick={() => openDrawer(business)}
                  className="w-8 h-8 rounded-full bg-secondary flex-center text-muted-foreground hover:text-primary transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(business.id)}
                  className="w-8 h-8 rounded-full bg-secondary flex-center text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-medium mt-4 line-clamp-1">{business.name}</h3>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Hash size={14} className="mr-2" />
                <span>Vergi No: {business.taxNumber}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <AtSign size={14} className="mr-2" />
                <span className="truncate">{business.email}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <User size={14} className="mr-2" />
                <span>{business.username}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBusinesses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex-center text-muted-foreground mb-4">
            <Building size={32} />
          </div>
          <h3 className="text-lg font-medium">İşletme Bulunamadı</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Arama kriterlerinize uygun işletme bulunmamaktadır.
          </p>
        </div>
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-50 transition-opacity",
          isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeDrawer}
      ></div>
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-full sm:w-96 bg-background z-50 shadow-xl transform transition-transform duration-300 ease-in-out",
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b">
            <h3 className="text-lg font-semibold">
              {isEditing ? "İşletme Düzenle" : "Yeni İşletme Ekle"}
            </h3>
            <button
              onClick={closeDrawer}
              className="w-8 h-8 rounded-full hover:bg-secondary flex-center"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {currentBusiness && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    İşletme Adı
                  </label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="ABC Teknoloji A.Ş."
                    value={currentBusiness.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Vergi Numarası
                  </label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="1234567890"
                    value={currentBusiness.taxNumber}
                    onChange={(e) => handleInputChange("taxNumber", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    E-posta Adresi
                  </label>
                  <input
                    type="email"
                    className="input-field w-full"
                    placeholder="info@isletme.com"
                    value={currentBusiness.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Kullanıcı Adı
                  </label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="isletmekullanici"
                    value={currentBusiness.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Şifre {isEditing && "(Değiştirmek için doldurun)"}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      className="input-field w-full"
                      placeholder={isEditing ? "••••••••" : "Şifre girin"}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
                      <Key size={16} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Logo (İsteğe Bağlı)
                  </label>
                  <div className="mt-1 border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center">
                    <div className="flex-center flex-col gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <div className="text-sm text-muted-foreground">
                        <label
                          htmlFor="logo-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80"
                        >
                          <span>Logo Yükle</span>
                          <input
                            id="logo-upload"
                            name="logo-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                          />
                        </label>
                        <p className="pl-1">veya sürükle & bırak</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF, 2MB'a kadar
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t p-5 flex gap-3 justify-end">
            <button
              onClick={closeDrawer}
              className="px-4 py-2 border rounded-lg hover:bg-secondary transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 button-hover"
            >
              <Save size={18} />
              <span>Kaydet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsletmeYonetimi;
