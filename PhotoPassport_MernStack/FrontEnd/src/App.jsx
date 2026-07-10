import { useState, useRef, useEffect } from "react";
import PhotoCard from "./PhotoCard";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

// Particles v3 Imports
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [init, setInit] = useState(false); 

  const [cropId, setCropId] = useState(null);
  const cropperRef = useRef(null);
  const imgRef = useRef(null);
  const nextId = useRef(0);

  const [notification, setNotification] = useState({ show: false, msg: "", error: true });
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ contact: "", message: "" });
  // const [feedbackData, setFeedbackData] = useState({ contact: "", message: "" });
  const [isSending, setIsSending] = useState(false); // For handling feedback submission state email: feedbackData.contact, message: feedbackData.message

  const [width, setWidth] = useState(390);
  const [height, setHeight] = useState(480);
  const [spacing, setSpacing] = useState(10);
  const [border, setBorder] = useState(2);



  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const showNotif = (msg, error = true) => {
    setNotification({ show: true, msg, error });
    setTimeout(() => setNotification({ show: false, msg: "", error }), 3000);
  };

  const addFiles = (files) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const newPhotos = Array.from(files)
      .filter((file) => validTypes.includes(file.type))
      .map((file) => ({
        id: nextId.current++,
        originalFile: file,
        croppedFile: null,
        previewUrl: URL.createObjectURL(file),
        copies: 6,
      }));

    if (newPhotos.length === 0) {
      showNotif("Please upload valid images (JPG, PNG, WEBP)");
      return;
    }
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  useEffect(() => {
    if (cropId !== null && imgRef.current) {
      if (cropperRef.current) cropperRef.current.destroy();
      cropperRef.current = new Cropper(imgRef.current, {
        aspectRatio: 384 / 472,
        viewMode: 1,
        guides: true,
      });
    }
  }, [cropId]);

  const handleCrop = () => {
    const cropper = cropperRef.current;
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas({ width: 400, height: 480 });
    canvas.toBlob((blob) => {
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === cropId
            ? { ...p, croppedFile: new File([blob], "crop.png"), previewUrl: URL.createObjectURL(blob) }
            : p
        )
      );
      cropper.destroy();
      setCropId(null);
      showNotif("Photo cropped!", false);
    });
  };

  const generatePDF = async () => {
    if (photos.length === 0) return showNotif("Upload a photo first.");
    setLoading(true);
    const formData = new FormData();
    photos.forEach((p) => {
      formData.append("images", p.croppedFile || p.originalFile);
      formData.append("copies", p.copies);
    });
    formData.append("width", width);
    formData.append("height", height);
    formData.append("spacing", spacing);

    try {
      const res = await fetch("http://localhost:5000/api/process", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Server error");
      const blob = await res.blob();
      setPdfUrl(URL.createObjectURL(blob));
      showNotif("Sheet Generated!", false);
    } catch (err) {
      showNotif(err.message);
    } finally {
      setLoading(false);
    }
  };

  // email js
  

  return (
    <div className="min-h-screen text-white relative selection:bg-blue-500/30" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Background & Particles */}
      <div className="fixed inset-0 bg-[#0a0f1a] -z-20" />
      {init && (
        <Particles
          id="tsparticles"
          className="fixed inset-0 -z-10"
          options={{
            fpsLimit: 120,
            particles: {
              color: { value: "#3b82f6" },
              links: { color: "#3b82f6", distance: 150, enable: true, opacity: 0.15, width: 5 },
              move: { enable: true, speed: 0.8 },
              number: { density: { enable: true, area: 800 }, value: 50 },
              opacity: { value: 0.3 },
              size: { value: { min: 1, max: 5 } },
            },
            interactivity: {
              events: { onHover: { enable: true, mode: "grab" } },
              modes: { grab: { distance: 200, links: { opacity: 0.5 } } }
            },
          }}
        />
      )}

      {/* Modern Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold italic">P</div>
            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              PASSPORT PHOTO PRO
            </span>
          </div>
        </div>
      </header>

      {/* Notification Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden py-1.5 shadow-lg">
        <marquee className="text-sm font-semibold uppercase tracking-widest">
            🚀 System Update: AI Auto-Alignment is now active • High-resolution PDF generation enabled • Report bugs via feedback button
        </marquee>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Section: Upload */}
          <div
            className="group border-2 border-dashed border-white/10 hover:border-blue-500/50 transition-all bg-white/[0.02] rounded-3xl p-12 cursor-pointer text-center mb-10"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input type="file" id="fileInput" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} accept="image/*" />
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">☁️</div>
            <h3 className="text-xl font-bold mb-1">Upload Portrait</h3>
            <p className="text-gray-400 text-sm">Drag images here or click to browse</p>
          </div>

          {/* Photos List */}
          <div className="grid gap-6">
            {photos.map((p) => (
              <PhotoCard
                key={p.id}
                photo={p}
                onRemove={() => setPhotos(prev => prev.filter(x => x.id !== p.id))}
                onCrop={() => setCropId(p.id)}
                onChangeCopies={(val) => setPhotos(prev => prev.map(x => x.id === p.id ? {...x, copies: val} : x))}
              />
            ))}
          </div>

          {/* 1. NEW: Add More Photos Button */}
          {photos.length > 0 && (
            <div className="flex justify-center mt-6">
              <button 
                onClick={() => document.getElementById("fileInput").click()}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-2xl text-sm font-bold transition-all"
              >
                <span className="text-lg">+</span> Add More Photos
              </button>
            </div>
          )}

          {/* Settings */}
          <div className="mt-12 pt-8 border-t border-white/5">
            <button className="text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition" onClick={() => setShowAdvanced(!showAdvanced)}>
              {showAdvanced ? "↑ Basic Settings" : "↓ Advanced Print Config"}
            </button>
            {showAdvanced && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                {[["Width", width, setWidth], ["Height", height, setHeight], ["Gap", spacing, setSpacing], ["Border", border, setBorder]].map(([label, val, set]) => (
                  <div key={label}>
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">{label}</label>
                    <input type="number" value={val} onChange={e => set(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none mt-1 transition-all" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Area */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <button onClick={generatePDF} disabled={loading || !photos.length} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50">
              {loading ? "Processing..." : "Generate Sheet"}
            </button>
            {pdfUrl && (
              <a href={pdfUrl} download className="flex-1 bg-white text-black hover:bg-gray-200 py-3 rounded-lg font-bold text-center transition-all">
                Download
              </a>
            )}
          </div>

          {pdfUrl && (
            <div className="mt-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <iframe src={pdfUrl} className="w-full h-[500px]" title="Preview" />
            </div>
          )}
        </div>
      </main>

      {/* 2. NEW: Feedback Modal (Matches Screenshot) */}
      {feedbackOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-[#1e2532] border border-white/10 w-full max-w-md rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Feedback / Bug Report</h2>
                <button onClick={() => setFeedbackOpen(false)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Your Contact (Email or Phone)"
                  className="w-full bg-[#2d3648] border border-blue-500/50 p-4 rounded-xl focus:ring-2 ring-blue-500 outline-none transition-all"
                  value={feedbackData.contact}
                  onChange={(e) => setFeedbackData({...feedbackData, contact: e.target.value})}
                />
                <textarea 
                  placeholder="Describe your issue or suggestion..."
                  rows="5"
                  className="w-full bg-[#2d3648] border border-white/10 p-4 rounded-xl focus:ring-2 ring-blue-500 outline-none transition-all resize-none"
                  value={feedbackData.message}
                  onChange={(e) => setFeedbackData({...feedbackData, message: e.target.value})}
                />
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
                  onClick={() => {
                    showNotif("Feedback sent! Thank you.", false);
                    setFeedbackOpen(false);
                    setFeedbackData({ contact: "", message: "" });
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating UI Button - Updated Color */}
      <button 
        onClick={() => setFeedbackOpen(true)}
        className="fixed bottom-8 right-8 bg-[#cc3333] hover:bg-red-600 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-xl hover:scale-110 transition-transform active:scale-95 z-40"
      >
        <span className="scale-x-[-1] inline-block">💬</span>
      </button>

      {/* Crop Modal & Notification Toast (Existing Logic) */}
        
              {/* Crop Modal */}
      {cropId !== null && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-[#121826] border border-white/10 p-8 rounded-[2rem] max-w-3xl w-full">
            <h2 className="text-2xl font-black mb-6">Crop Image</h2>
            <div className="rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <img ref={imgRef} src={photos.find(p => p.id === cropId)?.previewUrl} alt="To Crop" className="max-h-full" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <button onClick={handleCrop} className="bg-blue-600 py-4 rounded-xl font-bold hover:bg-blue-500">Apply Crop</button>
              <button onClick={() => setCropId(null)} className="bg-white/5 py-4 rounded-xl font-bold hover:bg-white/10">Cancel</button>
            </div>
          </div>
        </div>
      )}
           {notification.show && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 rounded-full font-bold shadow-2xl animate-bounce z-[110] ${notification.error ? "bg-red-500" : "bg-green-500"}`}>
          {notification.msg}
        </div>
      )}
    </div>
  );
}