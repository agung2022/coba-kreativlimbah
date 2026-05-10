import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { 
  Recycle, 
  Leaf, 
  Wrench, 
  Hammer, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Loader2,
  Sparkles,
  Info
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types for the form
interface LimbahFormState {
  waste_type: string;
  quantity: number;
  goal_category: string;
  difficulty_level: string;
  available_tools: string;
}

const INITIAL_FORM: LimbahFormState = {
  waste_type: "",
  quantity: 1,
  goal_category: "Functional",
  difficulty_level: "Easy",
  available_tools: ""
};

export default function App() {
  const [form, setForm] = useState<LimbahFormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const prompt = `
      Anda adalah "KreativLimbah AI Engine," seorang Desainer Produk Berkelanjutan Senior.
      Tugas Anda adalah memberikan ide upcycling (daur ulang kreatif) untuk mengubah limbah non-organik menjadi barang berguna atau dekorasi cantik.
      Gunakan Bahasa Indonesia yang sangat natural, akrab, dan mudah dimengerti (seperti sedang berbicara santai tapi tetap profesional).

      DATA PROYEK:
      - Jenis Sampah: ${form.waste_type}
      - Jumlah yang Tersedia: ${form.quantity}
      - Target Hasil: ${form.goal_category}
      - Tingkat Kesulitan: ${form.difficulty_level}
      - Alat yang Ada: ${form.available_tools}

      STRUKTUR JAWABAN (Markdown):
      1. # [Nama Proyek - Buat yang Unik!]
      2. [Paragraf pembuka: Jelaskan kenapa ide ini keren, kegunaannya apa, dan bagaimana ini membantu lingkungan].
      3. **Detail Proyek:**
         - 🛠️ Tingkat Kesulitan: ${form.difficulty_level}
         - ⏱️ Perkiraan Waktu: [Misal: 45 Menit]
         - 🌍 Dampak Lingkungan: [Penjelasan singkat kenapa ini bagus buat bumi]
      4. ## Bahan & Alat yang Dibutuhkan
         - Sebutkan semua bahannya dengan jumlah yang pas.
         - Sebutkan alat-alatnya.
      5. ## Langkah-Langkah Pembuatan
         - Berikan langkah 1, 2, 3, dst dengan bahasa yang jelas dan instruktif.
         - JANGAN sertakan gambar atau link gambar apa pun. Murni teks saja.
      6. > ### 👨‍🏫 Tips Pro dari Mentor
         > [Berikan trik rahasia agar hasilnya rapi, kuat, atau terlihat mewah (seperti barang toko)].
      7. **Pesan Keamanan:** [Ingatkan soal penggunaan benda tajam atau lem panas dengan santai].

      ATURAN PENTING:
      - JANGAN GUNAKAN GAMBAR.
      - Gunakan istilah yang umum di Indonesia (misal: "lem tembak" bukan "glue gun").
      - Pastikan idenya masuk akal (bisa dibuat beneran).
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      if (response.text) {
        setResult(response.text);
      } else {
        throw new Error("Gagal menghasilkan konten.");
      }
    } catch (err) {
      console.error(err);
      setError("Ups! Ada masalah saat menghubungkan ke mesin AI. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-natural-bg font-sans flex flex-col md:flex-row overflow-hidden text-natural-text">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-natural-white border-r border-natural-border p-8 flex flex-col justify-between overflow-y-auto">
        <div>
          <header className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-natural-accent rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-natural-accent/20">
              K
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-natural-heading">KreativLimbah</h1>
              <p className="text-[10px] uppercase tracking-widest text-natural-muted font-semibold">Senior AI Engine</p>
            </div>
          </header>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-natural-accent">Jenis Sampah</label>
              <input 
                required
                type="text"
                placeholder="Misal: Sachet Kopi, Botol Bekas..."
                className="w-full p-3 bg-natural-input border border-natural-border rounded-lg text-sm font-medium focus:ring-1 focus:ring-natural-accent focus:outline-none transition-all placeholder:text-natural-muted/50"
                value={form.waste_type}
                onChange={(e) => setForm({ ...form, waste_type: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-natural-accent">Jumlah</label>
                <input 
                  type="number"
                  min="1"
                  className="w-full p-3 bg-natural-input border border-natural-border rounded-lg text-sm font-medium focus:ring-1 focus:ring-natural-accent focus:outline-none transition-all"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-natural-accent">Kesulitan</label>
                <select 
                  className="w-full p-3 bg-natural-input border border-natural-border rounded-lg text-sm font-medium focus:ring-1 focus:ring-natural-accent focus:outline-none transition-all cursor-pointer appearance-none"
                  value={form.difficulty_level}
                  onChange={(e) => setForm({ ...form, difficulty_level: e.target.value })}
                >
                  <option value="Easy">Gampang</option>
                  <option value="Medium">Sedang</option>
                  <option value="Hard">Lumayan Sulit</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-natural-accent">Kategori Hasil</label>
              <select 
                className="w-full p-3 bg-natural-input border border-natural-border rounded-lg text-sm font-medium focus:ring-1 focus:ring-natural-accent focus:outline-none transition-all cursor-pointer appearance-none"
                value={form.goal_category}
                onChange={(e) => setForm({ ...form, goal_category: e.target.value })}
              >
                <option value="Home Decor">Hiasan Rumah</option>
                <option value="Educational">Edukasi Anak</option>
                <option value="Functional">Alat Fungsional</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-natural-accent">Alat yang Kamu Punya</label>
              <textarea 
                placeholder="Gunting, Lem Tembak, Cat, dll..."
                className="w-full p-3 bg-natural-input border border-natural-border rounded-lg text-sm font-medium focus:ring-1 focus:ring-natural-accent focus:outline-none transition-all min-h-[100px] resize-none placeholder:text-natural-muted/50"
                value={form.available_tools}
                onChange={(e) => setForm({ ...form, available_tools: e.target.value })}
              />
            </div>

            <button 
              disabled={loading}
              className={cn(
                "w-full py-4 bg-natural-accent hover:bg-natural-accent-hover text-white rounded-2xl font-bold transition-all shadow-lg shadow-natural-accent/20 flex items-center justify-center gap-2",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {loading ? "Sedang Mengoptimasi..." : "Rancang Produk"}
            </button>
          </form>
        </div>

        <footer className="mt-8 text-center md:text-left">
          <p className="text-[10px] font-bold text-natural-accent uppercase tracking-[0.2em]">
            #JUARAVIBECODING
          </p>
        </footer>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <AnimatePresence mode="wait">
          {!result && !loading && !error && (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-20 h-20 bg-natural-white border border-natural-border rounded-full flex items-center justify-center text-natural-muted/30 shadow-inner">
                <Leaf size={40} />
              </div>
              <div className="max-w-md">
                <h2 className="text-3xl font-serif text-natural-heading">Siap untuk proyek baru?</h2>
                <p className="text-natural-description mt-2">Masukkan detail limbah Anda di sebelah kiri untuk memulai proses transformasi menjadi produk bernilai tinggi.</p>
              </div>
            </motion.div>
          )}

          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="relative">
                <div className="w-24 h-24 border-4 border-natural-accent/10 border-t-natural-accent rounded-full animate-spin" />
                <Recycle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-natural-accent animate-pulse" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-serif italic text-natural-accent">\"Upcycling adalah bentuk harapan...\"</h3>
                <p className="text-natural-muted text-sm mt-2 font-medium tracking-widest uppercase animate-pulse">Menghitung Dampak Berkelanjutan...</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-4"
            >
              <AlertCircle size={48} className="text-rose-500" />
              <div className="max-w-md">
                <h2 className="text-2xl font-serif text-rose-900">Wah, Mesin Sedang Ngadat</h2>
                <p className="text-rose-600/70 mt-2">{error}</p>
                <button 
                  onClick={handleGenerate}
                  className="mt-6 px-6 py-2 bg-rose-500 text-white rounded-lg font-bold hover:bg-rose-600 transition-all"
                >
                  Coba Lagi Yuk
                </button>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.section 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 p-6 md:p-12 flex flex-col gap-8 max-w-5xl mx-auto w-full"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <header className="markdown-body">
                    {/* We rely on the AI putting the title in h1 and description in p */}
                    <ReactMarkdown components={{
                      h1: ({node, ...props}) => <h2 className="text-4xl md:text-5xl font-serif font-light text-natural-heading leading-tight mb-4" {...props} />,
                      p: ({node, ...props}) => {
                        // If it contains "Difficulty" or "Impact", we might want to hide it or style it differently if it's the stats line
                        if (props.children?.toString().includes("Difficulty:") || props.children?.toString().includes("Impact:")) {
                          return null;
                        }
                        return <p className="text-natural-description leading-relaxed text-base max-w-2xl" {...props} />;
                      }
                    }}>
                      {result.split("##")[0]} 
                    </ReactMarkdown>
                  </header>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-2 px-4 py-2 bg-natural-white rounded-full border border-natural-border shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-[#D97706]"></div>
                    <span className="text-[10px] font-bold uppercase tracking-tight">Level: {form.difficulty_level}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-natural-white rounded-full border border-natural-border shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-tight text-[#166534]">Ide Ramah Bumi</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 h-auto">
                <div className="md:col-span-12 lg:col-span-7 bg-natural-white rounded-[32px] p-8 border border-natural-border shadow-sm">
                  <ReactMarkdown 
                    allowedElements={['h2', 'ol', 'li', 'p', 'strong', 'img']}
                    components={{
                      h2: ({node, ...props}) => (
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-natural-muted mb-6 flex items-center gap-2">
                          <span className="w-4 h-[1px] bg-natural-muted"></span> Langkah-Langkah Pembuatan
                        </h3>
                      ),
                      img: ({node, ...props}) => (
                        <img 
                          {...props} 
                          className="w-full h-48 object-cover rounded-2xl my-6 grayscale hover:grayscale-0 transition-all duration-500 shadow-md"
                          referrerPolicy="no-referrer"
                        />
                      )
                    }}
                  >
                    {result.includes("## Langkah-Langkah Pembuatan") ? "## " + result.split("## Langkah-Langkah Pembuatan")[1].split("##")[0] : 
                     result.includes("## Step-by-Step Instructions") ? "## " + result.split("## Step-by-Step Instructions")[1].split("##")[0] : ""}
                  </ReactMarkdown>
                </div>

                <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-6">
                  <div className="bg-[#F2F1EC] rounded-[32px] p-8 border border-natural-border shadow-sm shrink-0">
                    <ReactMarkdown 
                      allowedElements={['h2', 'ul', 'li', 'strong']}
                      components={{
                        h2: ({node, ...props}) => (
                          <h3 className="text-[11px] font-bold uppercase tracking-widest text-natural-muted mb-4">Bahan & Alat</h3>
                        )
                      }}
                    >
                      {result.includes("## Bahan & Alat yang Dibutuhkan") ? "## " + result.split("## Bahan & Alat yang Dibutuhkan")[1].split("##")[0] :
                       result.includes("## Materials Needed") ? "## " + result.split("## Materials Needed")[1].split("##")[0] : ""}
                    </ReactMarkdown>
                  </div>

                  <div className="shrink-0">
                    <ReactMarkdown 
                      allowedElements={['blockquote', 'h3', 'p', 'italic']}
                    >
                      {result.includes("> ### Tips Pro dari Desainer Senior") ? "> ### Tips Pro dari Desainer Senior" + result.split("> ### Tips Pro dari Desainer Senior")[1].split("##")[0] : 
                       result.includes("### Tips Pro dari Desainer Senior") ? "### Tips Pro dari Desainer Senior" + result.split("### Tips Pro dari Desainer Senior")[1].split("##")[0] :
                       result.includes("> ### Senior Dev Pro-Tip") ? "> ### Senior Dev Pro-Tip" + result.split("> ### Senior Dev Pro-Tip")[1].split("##")[0] : ""}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>

              <footer className="flex items-center justify-between pt-4 border-t border-natural-border mt-auto">
                <p className="text-[10px] font-medium text-[#A1A18E] italic uppercase tracking-wider">
                  Hati-hati saat menggunakan alat tajam. Keselamatan adalah prioritas utama.
                </p>
                <p className="text-[10px] font-bold text-natural-accent uppercase tracking-[0.2em]">
                   SUSTAINABLE TECH
                </p>
              </footer>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

