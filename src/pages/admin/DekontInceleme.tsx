
import { useState } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ZoomIn,
  Printer,
  Download,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Dekont tipini tanımlama
interface Receipt {
  id: string;
  studentName: string;
  businessName: string;
  amount: number;
  date: string;
  status: "inceleme" | "onay" | "red";
  rejectionReason?: string;
  image: string;
}

// Örnek dekont resimleri
const receiptImages = [
  "https://i.ibb.co/QCwSxDm/invoice-example-1.jpg",
  "https://i.ibb.co/k6T6nNq/invoice-example-2.jpg",
  "https://i.ibb.co/DDTQDfQ/invoice-example-3.jpg",
];

const DekontInceleme = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([
    {
      id: "1",
      studentName: "Ahmet Yılmaz",
      businessName: "ABC Teknoloji A.Ş.",
      amount: 2500,
      date: "2023-10-15",
      status: "inceleme",
      image: receiptImages[0],
    },
    {
      id: "2",
      studentName: "Mehmet Kaya",
      businessName: "XYZ Mühendislik Ltd. Şti.",
      amount: 3000,
      date: "2023-10-12",
      status: "inceleme",
      image: receiptImages[1],
    },
    {
      id: "3",
      studentName: "Ayşe Demir",
      businessName: "Yıldız Bilişim Hizmetleri",
      amount: 2750,
      date: "2023-10-10",
      status: "onay",
      image: receiptImages[2],
    },
    {
      id: "4",
      studentName: "Fatma Şahin",
      businessName: "Merkez Yazılım Danışmanlık",
      amount: 3200,
      date: "2023-10-09",
      status: "red",
      rejectionReason: "Eksik bilgi",
      image: receiptImages[0],
    },
    {
      id: "5",
      studentName: "Ali Yıldız",
      businessName: "Akış Teknoloji Sistemleri",
      amount: 2900,
      date: "2023-10-08",
      status: "inceleme",
      image: receiptImages[1],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "inceleme" | "onay" | "red">("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionNote, setRejectionNote] = useState("");
  const [currentReceiptId, setCurrentReceiptId] = useState<string | null>(null);

  const { toast } = useToast();

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch =
      receipt.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || receipt.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const openImagePreview = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImagePreview = () => {
    setSelectedImage(null);
  };

  const openRejectionDialog = (receiptId: string) => {
    setCurrentReceiptId(receiptId);
    setIsRejectionDialogOpen(true);
  };

  const closeRejectionDialog = () => {
    setIsRejectionDialogOpen(false);
    setRejectionReason("");
    setRejectionNote("");
    setCurrentReceiptId(null);
  };

  const handleApprove = (receiptId: string) => {
    setReceipts((prev) =>
      prev.map((r) =>
        r.id === receiptId
          ? { ...r, status: "onay", rejectionReason: undefined }
          : r
      )
    );

    toast({
      title: "Dekont Onaylandı",
      description: "Dekont başarıyla onaylandı.",
      variant: "default",
    });
  };

  const handleReject = () => {
    if (!currentReceiptId) return;
    
    if (!rejectionReason) {
      toast({
        title: "Hata",
        description: "Lütfen red nedeni seçin.",
        variant: "destructive",
      });
      return;
    }

    setReceipts((prev) =>
      prev.map((r) =>
        r.id === currentReceiptId
          ? { 
              ...r, 
              status: "red", 
              rejectionReason: `${rejectionReason}${rejectionNote ? ': ' + rejectionNote : ''}` 
            }
          : r
      )
    );

    toast({
      title: "Dekont Reddedildi",
      description: "Dekont reddedildi ve işletmeye bildirim gönderildi.",
      variant: "destructive",
    });

    closeRejectionDialog();
  };

  const getStatusBadge = (status: "inceleme" | "onay" | "red") => {
    switch (status) {
      case "inceleme":
        return (
          <div className="status-inceleme flex items-center gap-1">
            <AlertCircle size={12} />
            <span>İncelemede</span>
          </div>
        );
      case "onay":
        return (
          <div className="status-onay flex items-center gap-1">
            <CheckCircle size={12} />
            <span>Onaylandı</span>
          </div>
        );
      case "red":
        return (
          <div className="status-red flex items-center gap-1">
            <XCircle size={12} />
            <span>Reddedildi</span>
          </div>
        );
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Dekont İnceleme</h1>
        <p className="text-muted-foreground mt-1">
          İşletmeler tarafından yüklenen dekontları inceleyin ve onaylayın.
        </p>
      </div>

      {/* Filtreler */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="input-field pl-10 w-full"
            placeholder="Öğrenci veya işletme ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
            <Filter size={18} />
          </div>
          <select
            className="input-field pl-10 pr-10 appearance-none min-w-[180px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">Tüm Durumlar</option>
            <option value="inceleme">İncelemede</option>
            <option value="onay">Onaylandı</option>
            <option value="red">Reddedildi</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
            <ChevronDown size={18} />
          </div>
        </div>
      </div>

      {/* Dekont Listesi */}
      <div className="glass-card overflow-hidden">
        {filteredReceipts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Öğrenci
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    İşletme
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Tutar
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Tarih
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Durum
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Dekont
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReceipts.map((receipt) => (
                  <tr key={receipt.id} className="border-b hover:bg-secondary/30">
                    <td className="p-4">{receipt.studentName}</td>
                    <td className="p-4">{receipt.businessName}</td>
                    <td className="p-4">{receipt.amount.toLocaleString('tr-TR')} ₺</td>
                    <td className="p-4">
                      {new Date(receipt.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="p-4">{getStatusBadge(receipt.status)}</td>
                    <td className="p-4">
                      <div 
                        className="w-16 h-16 rounded border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openImagePreview(receipt.image)}
                      >
                        <img
                          src={receipt.image}
                          alt="Dekont"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {receipt.status === "inceleme" ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleApprove(receipt.id)}
                            className="p-2 rounded-full bg-success/10 text-success hover:bg-success/20 transition-colors"
                            title="Onayla"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => openRejectionDialog(receipt.id)}
                            className="p-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                            title="Reddet"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          {receipt.status === "onay" ? "Onaylandı" : (
                            <span title={receipt.rejectionReason}>
                              {receipt.rejectionReason}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex-center text-muted-foreground mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Dekont Bulunamadı</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Arama kriterlerinize uygun dekont bulunmamaktadır.
            </p>
          </div>
        )}
      </div>

      {/* Resim Önizleme Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closeImagePreview}>
          <div className="relative max-w-3xl w-full bg-background rounded-xl p-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <Printer size={18} />
              </button>
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <Download size={18} />
              </button>
              <button
                onClick={closeImagePreview}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-8 max-h-[70vh] overflow-auto">
              <img src={selectedImage} alt="Dekont Önizleme" className="w-full" />
            </div>
          </div>
        </div>
      )}

      {/* Red Nedeni Modal */}
      {isRejectionDialogOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-background rounded-xl shadow-lg animate-scale-in">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Dekont Red Nedeni</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Red Nedeni</label>
                <select
                  className="input-field w-full"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                >
                  <option value="">Bir neden seçin...</option>
                  <option value="Eksik bilgi">Eksik bilgi</option>
                  <option value="Yanlış format">Yanlış format</option>
                  <option value="Okunamıyor">Okunamıyor</option>
                  <option value="Hatalı tutar">Hatalı tutar</option>
                  <option value="Geçersiz tarih">Geçersiz tarih</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Ek Açıklama (İsteğe Bağlı)</label>
                <textarea
                  className="input-field w-full resize-none h-24"
                  placeholder="Ek açıklama girin..."
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                ></textarea>
              </div>
            </div>
            
            <div className="border-t p-4 flex justify-end gap-3">
              <button
                onClick={closeRejectionDialog}
                className="px-4 py-2 border rounded-lg hover:bg-secondary transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleReject}
                className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors"
              >
                Reddet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DekontInceleme;
