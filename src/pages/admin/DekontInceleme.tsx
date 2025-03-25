import { useState, useRef } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Printer,
  Download,
  X,
  Plus,
  Minus,
  RotateCw,
  Trash2,
  PencilLine,
  Save,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNotification } from "@/hooks/useNotification";

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
  notes?: string;
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
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionNote, setRejectionNote] = useState("");
  const [currentReceiptId, setCurrentReceiptId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const imageRef = useRef<HTMLImageElement>(null);

  const { toast } = useToast();
  const { addNotification } = useNotification();

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch =
      receipt.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || receipt.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const openImagePreview = (imageUrl: string, receiptId: string) => {
    setSelectedImage(imageUrl);
    setSelectedReceiptId(receiptId);
    setZoomLevel(100);
    setRotation(0);
    
    const receipt = receipts.find(r => r.id === receiptId);
    setNoteText(receipt?.notes || "");
  };

  const closeImagePreview = () => {
    setSelectedImage(null);
    setSelectedReceiptId(null);
    setIsAddingNote(false);
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
    const receipt = receipts.find(r => r.id === receiptId);
    if (!receipt) return;
    
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
    
    addNotification({
      title: "Dekont Onaylandı",
      message: `${receipt.studentName} adlı öğrencinin ${receipt.amount.toLocaleString('tr-TR')} ₺ tutarındaki dekontu onaylandı.`,
      type: "success",
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

    const receipt = receipts.find(r => r.id === currentReceiptId);
    if (!receipt) return;

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
    
    addNotification({
      title: "Dekont Reddedildi",
      message: `${receipt.studentName} adlı öğrencinin dekontu reddedildi. Neden: ${rejectionReason}${rejectionNote ? ': ' + rejectionNote : ''}`,
      type: "error",
    });

    closeRejectionDialog();
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 20, 200));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 20, 40));
  };

  const resetZoom = () => {
    setZoomLevel(100);
    setRotation(0);
  };

  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const toggleNoteEditor = () => {
    setIsAddingNote(!isAddingNote);
  };

  const saveNote = () => {
    if (selectedReceiptId) {
      const receipt = receipts.find(r => r.id === selectedReceiptId);
      if (!receipt) return;
      
      setReceipts(prev => 
        prev.map(r => 
          r.id === selectedReceiptId 
            ? { ...r, notes: noteText }
            : r
        )
      );
      
      setIsAddingNote(false);
      
      toast({
        title: "Not Kaydedildi",
        description: "Dekont için notunuz başarıyla kaydedildi.",
        variant: "default",
      });
      
      if (noteText && noteText.trim() !== "") {
        addNotification({
          title: "Dekont Notları Güncellendi",
          message: `${receipt.studentName} adlı öğrencinin dekontuna not eklendi.`,
          type: "info",
        });
      }
    }
  };

  const downloadImage = () => {
    if (selectedImage) {
      const link = document.createElement('a');
      link.href = selectedImage;
      link.download = `dekont-${selectedReceiptId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Dekont İndirildi",
        description: "Dekont başarıyla indirildi.",
        variant: "default",
      });
    }
  };

  const printImage = () => {
    if (imageRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Dekont Yazdır</title>
              <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                img { max-width: 100%; max-height: 100vh; }
              </style>
            </head>
            <body>
              <img src="${selectedImage}" />
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                    window.close();
                  }, 500);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
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
                        className="w-16 h-16 rounded border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative group"
                        onClick={() => openImagePreview(receipt.image, receipt.id)}
                      >
                        <img
                          src={receipt.image}
                          alt="Dekont"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <ZoomIn size={20} className="text-white" />
                        </div>
                        {receipt.notes && (
                          <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full m-1" 
                               title="Bu dekont için not bulunuyor"></div>
                        )}
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

      {/* Gelişmiş Resim Önizleme Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closeImagePreview}>
          <div className="relative max-w-4xl w-full bg-background rounded-xl shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-medium">Dekont Önizleme</h3>
              <div className="flex gap-2">
                <button 
                  onClick={rotateImage}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  title="Döndür"
                >
                  <RotateCw size={18} />
                </button>
                <button 
                  onClick={zoomIn}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  title="Yakınlaştır"
                >
                  <Plus size={18} />
                </button>
                <button 
                  onClick={zoomOut}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  title="Uzaklaştır"
                >
                  <Minus size={18} />
                </button>
                <button 
                  onClick={resetZoom}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  title="Sıfırla"
                >
                  <AlertCircle size={18} />
                </button>
                <button 
                  onClick={printImage}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  title="Yazdır"
                >
                  <Printer size={18} />
                </button>
                <button 
                  onClick={downloadImage}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  title="İndir"
                >
                  <Download size={18} />
                </button>
                <button 
                  onClick={toggleNoteEditor}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  title="Not Ekle/Düzenle"
                >
                  <PencilLine size={18} />
                </button>
                <button
                  onClick={closeImagePreview}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  title="Kapat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
              <div className="lg:col-span-2 overflow-hidden flex justify-center items-center bg-black/5 rounded-lg h-[60vh]">
                <div 
                  className="relative overflow-auto h-full w-full flex items-center justify-center"
                  style={{ 
                    padding: `${zoomLevel > 100 ? '20px' : '0'}`,
                  }}
                >
                  <img 
                    ref={imageRef}
                    src={selectedImage} 
                    alt="Dekont Önizleme" 
                    className="transition-transform duration-200 ease-out"
                    style={{ 
                      transform: `scale(${zoomLevel/100}) rotate(${rotation}deg)`,
                      transformOrigin: 'center center',
                      maxHeight: zoomLevel > 100 ? 'none' : '100%',
                      maxWidth: zoomLevel > 100 ? 'none' : '100%',
                    }}
                  />
                </div>
              </div>
              
              <div className="lg:col-span-1">
                {selectedReceiptId && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Öğrenci</h4>
                      <p className="font-medium">
                        {receipts.find(r => r.id === selectedReceiptId)?.studentName}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">İşletme</h4>
                      <p className="font-medium">
                        {receipts.find(r => r.id === selectedReceiptId)?.businessName}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Tutar</h4>
                      <p className="font-medium">
                        {receipts.find(r => r.id === selectedReceiptId)?.amount.toLocaleString('tr-TR')} ₺
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Tarih</h4>
                      <p className="font-medium">
                        {new Date(receipts.find(r => r.id === selectedReceiptId)?.date || "").toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Durum</h4>
                      <div className="font-medium">
                        {getStatusBadge(receipts.find(r => r.id === selectedReceiptId)?.status || "inceleme")}
                      </div>
                    </div>
                    
                    {receipts.find(r => r.id === selectedReceiptId)?.status === "red" && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Red Nedeni</h4>
                        <p className="font-medium text-destructive">
                          {receipts.find(r => r.id === selectedReceiptId)?.rejectionReason}
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Notlar</h4>
                      
                      {isAddingNote ? (
                        <div className="space-y-2">
                          <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Dekont için not ekleyin..."
                            className="w-full p-2 border rounded-lg h-32 resize-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setIsAddingNote(false)}
                              className="px-4 py-2 border rounded-lg hover:bg-secondary transition-colors"
                            >
                              İptal
                            </button>
                            <button
                              onClick={saveNote}
                              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                              <Save size={14} className="mr-1 inline-block" />
                              Kaydet
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="min-h-[60px] border rounded-lg p-3 bg-secondary/20">
                          {receipts.find(r => r.id === selectedReceiptId)?.notes ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {receipts.find(r => r.id === selectedReceiptId)?.notes}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Bu dekont için not bulunmuyor. Not eklemek için kalem simgesine tıklayın.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {receipts.find(r => r.id === selectedReceiptId)?.status === "inceleme" && (
                      <div className="pt-2 border-t flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            handleApprove(selectedReceiptId);
                            closeImagePreview();
                          }}
                          className="px-4 py-2 rounded-lg bg-success text-white hover:bg-success/90 transition-colors"
                       

