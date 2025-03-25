
import { useState, useEffect } from "react";
import { Paperclip, CheckCircle, XCircle, AlertCircle, Search, Download, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Öğrenci tipi
interface Student {
  id: string;
  name: string;
  internshipFee: number;
  receiptStatus: "yuklenmedi" | "inceleme" | "onay" | "red";
  rejectionReason?: string;
  receiptFile?: File;
}

const OgrenciListesi = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [businessName, setBusinessName] = useState("Örnek İşletme A.Ş.");

  const { toast } = useToast();

  // Örnek öğrenci verilerini yükle
  useEffect(() => {
    // Gerçek API isteği simülasyonu
    setTimeout(() => {
      const sampleStudents: Student[] = [
        {
          id: "1",
          name: "Ahmet Yılmaz",
          internshipFee: 2500,
          receiptStatus: "yuklenmedi",
        },
        {
          id: "2",
          name: "Mehmet Kaya",
          internshipFee: 3000,
          receiptStatus: "inceleme",
        },
        {
          id: "3",
          name: "Ayşe Demir",
          internshipFee: 2750,
          receiptStatus: "onay",
        },
        {
          id: "4",
          name: "Fatma Şahin",
          internshipFee: 3200,
          receiptStatus: "red",
          rejectionReason: "Eksik bilgi: Öğrenci bilgileri eksik",
        },
        {
          id: "5",
          name: "Zeynep Aydın",
          internshipFee: 2800,
          receiptStatus: "yuklenmedi",
        },
        {
          id: "6",
          name: "Ali Yıldız",
          internshipFee: 2900,
          receiptStatus: "yuklenmedi",
        },
        {
          id: "7",
          name: "Hasan Kılıç",
          internshipFee: 3100,
          receiptStatus: "yuklenmedi",
        },
      ];
      setStudents(sampleStudents);
      setLoading(false);
    }, 1000);

    // İşletme adını local storage'dan al
    const storedName = sessionStorage.getItem("businessName");
    if (storedName) {
      setBusinessName(storedName);
    }
  }, []);

  // Dosya yüklemesi için
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, studentId: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Doğrulama: Sadece PDF veya JPEG dosyaları kabul edilecek
    const file = files[0];
    const fileType = file.type;
    
    if (
      fileType !== "application/pdf" &&
      fileType !== "image/jpeg" &&
      fileType !== "image/jpg"
    ) {
      toast({
        title: "Geçersiz Dosya Formatı",
        description: "Lütfen sadece PDF veya JPEG/JPG dosyası yükleyin.",
        variant: "destructive",
      });
      return;
    }

    // 200KB boyut sınırlaması
    if (file.size > 200 * 1024) {
      toast({
        title: "Dosya Boyutu Çok Büyük",
        description: "Dosya boyutu 200KB'dan küçük olmalıdır.",
        variant: "destructive",
      });
      return;
    }

    // Yükleme simülasyonu başlat
    setSelectedFileId(studentId);
    setIsUploading(true);
    setUploadProgress(0);

    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setIsUploading(false);
          
          // Öğrenci durumunu güncelle
          setStudents((prevStudents) =>
            prevStudents.map((student) =>
              student.id === studentId
                ? {
                    ...student,
                    receiptStatus: "inceleme",
                    receiptFile: file,
                  }
                : student
            )
          );

          toast({
            title: "Dekont Yüklendi",
            description: "Dekont başarıyla yüklendi ve incelemeye alındı.",
          });

          return 0;
        }
        return prev + 5;
      });
    }, 100);
  };

  // Dekont yükleme butonunu görüntüle
  const renderUploadButton = (student: Student) => {
    if (student.receiptStatus === "onay") {
      return (
        <div className="text-success font-medium flex items-center gap-1">
          <CheckCircle size={16} />
          <span>Onaylandı</span>
        </div>
      );
    }

    if (student.receiptStatus === "inceleme") {
      return (
        <div className="status-inceleme">
          <AlertCircle size={16} />
          <span>İncelemede</span>
        </div>
      );
    }

    if (student.receiptStatus === "red") {
      return (
        <div className="flex flex-col gap-1">
          <div className="status-red">
            <XCircle size={16} />
            <span>Reddedildi</span>
          </div>
          <label
            htmlFor={`file-upload-${student.id}`}
            className="text-xs text-primary underline cursor-pointer"
          >
            Yeniden Yükle
          </label>
          <input
            id={`file-upload-${student.id}`}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg"
            onChange={(e) => handleFileChange(e, student.id)}
          />
        </div>
      );
    }

    // "yuklenmedi" durumu
    return (
      <>
        <label
          htmlFor={`file-upload-${student.id}`}
          className={cn(
            "border border-primary bg-primary/5 text-primary px-3 py-2 rounded-lg cursor-pointer flex items-center gap-1 hover:bg-primary/10 transition-colors",
            isUploading && selectedFileId === student.id
              ? "opacity-50 cursor-not-allowed"
              : "button-hover"
          )}
          title="PDF veya JPEG, max 200KB"
        >
          {isUploading && selectedFileId === student.id ? (
            <>
              <span className="text-xs">{uploadProgress}%</span>
            </>
          ) : (
            <>
              <Paperclip size={16} />
              <span>Dekont Yükle</span>
            </>
          )}
        </label>
        <input
          id={`file-upload-${student.id}`}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg"
          onChange={(e) => handleFileChange(e, student.id)}
          disabled={isUploading && selectedFileId === student.id}
        />
        
        {isUploading && selectedFileId === student.id && (
          <div className="mt-1 w-full h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </>
    );
  };

  // Durum bilgisini görüntüle
  const getStatusInfo = (student: Student) => {
    if (student.receiptStatus === "red" && student.rejectionReason) {
      return (
        <div 
          className="text-xs text-destructive cursor-help"
          title={student.rejectionReason}
        >
          <span>{student.rejectionReason}</span>
        </div>
      );
    }
    return null;
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-semibold">Öğrenci Listesi</h1>
          <p className="text-muted-foreground text-sm md:text-base flex items-center gap-1">
            <span className="hidden sm:inline">İşletme:</span>
            <span className="font-medium">{businessName}</span>
          </p>
        </div>
        <p className="text-muted-foreground mt-1">
          Stajyer öğrencilerinizin devlet destekli staj ücretleri listesi.
        </p>
      </div>

      {/* Arama Alanı */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="input-field pl-10 w-full"
            placeholder="Öğrenci ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Liste */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p>Öğrenciler yükleniyor...</p>
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-secondary/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Sıra No
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Adı Soyadı
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Staj Ücreti
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                    Dekont
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className="border-b hover:bg-secondary/20">
                    <td className="py-4 px-4">{index + 1}</td>
                    <td className="py-4 px-4 font-medium">{student.name}</td>
                    <td className="py-4 px-4">
                      {student.internshipFee.toLocaleString("tr-TR")} ₺
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col items-center gap-1">
                        {renderUploadButton(student)}
                        {getStatusInfo(student)}
                      </div>
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Öğrenci Bulunamadı</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Arama kriterlerinize uygun öğrenci bulunmamaktadır.
            </p>
          </div>
        )}
      </div>

      {/* Bilgi Kartı */}
      <div className="mt-6 bg-info/10 p-4 rounded-lg border border-info/20">
        <div className="flex items-start gap-2">
          <AlertCircle size={18} className="text-info mt-0.5" />
          <div>
            <p className="text-sm font-medium">Dekont Yükleme Bilgisi</p>
            <p className="text-xs text-muted-foreground mt-1">
              Sadece PDF veya JPEG formatında, maksimum 200KB boyutunda dosya yükleyebilirsiniz. İnceleme sonucu otomatik olarak güncellenecektir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OgrenciListesi;
