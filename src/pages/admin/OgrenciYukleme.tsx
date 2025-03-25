
import { useState } from "react";
import { Upload, File, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OgrenciYukleme = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.filter(
      (file) =>
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "text/csv"
    );

    if (validFiles.length === 0) {
      toast({
        title: "Geçersiz dosya formatı",
        description: "Lütfen sadece Excel veya CSV dosyası yükleyin.",
        variant: "destructive",
      });
      return;
    }

    // Dosya yükleme simülasyonu
    setUploadStatus("uploading");
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus("success");
          setUploadedFiles((prevFiles) => [...prevFiles, ...validFiles]);
          
          toast({
            title: "Dosyalar başarıyla yüklendi",
            description: `${validFiles.length} dosya sisteme eklendi.`,
            variant: "default",
          });
          
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Öğrenci Devlet Desteği Tablosu Yükleme</h1>
        <p className="text-muted-foreground mt-1">
          Excel veya CSV dosyası yükleyerek öğrenci listesini sisteme ekleyin.
        </p>
      </div>

      {/* Dosya Yükleme Alanı */}
      <div className="glass-card p-6 mb-8">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/30"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleFileDrop}
        >
          <div className="flex-center flex-col gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex-center text-primary">
              <Upload size={28} />
            </div>
            <h3 className="text-lg font-medium">Dosyaları buraya sürükle & bırak</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Excel (.xlsx, .xls) veya CSV formatında dosya yükleyin. Her bir dosya
              maksimum 5MB olabilir.
            </p>

            <div className="mt-4">
              <label
                htmlFor="file-upload"
                className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors button-hover inline-flex items-center gap-2"
              >
                <File size={16} />
                Dosya Seç
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        {/* Yükleme Durumu */}
        {uploadStatus === "uploading" && (
          <div className="mt-6 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Yükleniyor...</span>
              <span className="text-sm">{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Yüklenen Dosyalar Listesi */}
      {uploadedFiles.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle size={18} className="text-success" />
            Yüklenen Dosyalar
          </h2>

          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border p-3 flex items-center justify-between card-hover"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex-center text-primary">
                    <File size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-success">
                    <CheckCircle size={18} />
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-info/10 p-3 rounded-lg border border-info/20">
            <div className="flex items-start gap-2">
              <AlertCircle size={18} className="text-info mt-0.5" />
              <div>
                <p className="text-sm font-medium">Doğrulama Sonuçları</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tüm dosyalar başarıyla doğrulandı. Toplam 156 öğrenci kaydı
                  eklendi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OgrenciYukleme;
