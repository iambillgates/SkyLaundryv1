"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchId, setSearchId] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Observer untuk animasi scroll (Reveal)
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }, []);

  const handleCheckStatus = async () => {
    if (!searchId) return;
    setIsLoading(true);
    setErrorMsg('');
    setSearchResult(null);

    try {
      const response = await axios.get(`http://localhost:4000/orders/${searchId}`);
      setSearchResult(response.data);
    } catch (_) {
      setErrorMsg('Data tidak ditemukan. Cek kembali ID Resi Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-slate-50 text-slate-900 leading-relaxed overflow-x-hidden min-h-screen selection:bg-blue-200">
      
      {/* Background Blobs */}
      <div className="bg-blob bg-blob-sm bg-blue-400 top-0 left-[-50px]"></div>
      <div className="bg-blob bg-blob-sm bg-purple-400 bottom-0 right-[-50px]"></div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300 glass-morphism">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 group cursor-pointer shrink-0">
              <div className="bg-blue-600 p-1 rounded-xl shadow-lg w-9 h-9 flex items-center justify-center">
                <span className="text-white font-bold text-xs">SL</span>
              </div>
              <span className="text-base sm:text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-sky-500">
                Sky Laundry
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <a href="#beranda" className="text-xs font-bold text-slate-600 hover:text-blue-600 uppercase tracking-wider transition-colors">Beranda</a>
              <a href="#cek-status" className="text-xs font-bold text-slate-600 hover:text-blue-600 uppercase tracking-wider transition-colors">Cek Status</a>
              <a href="#layanan" className="text-xs font-bold text-slate-600 hover:text-blue-600 uppercase tracking-wider transition-colors">Layanan</a>
              <a href="#kontak" className="text-xs font-bold text-slate-600 hover:text-blue-600 uppercase tracking-wider transition-colors">Kontak</a>
              <Link href="/login">
                <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95">
                  Login Staff
                </button>
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg bg-slate-100 text-slate-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-2 shadow-2xl absolute w-full left-0 animate-in slide-in-from-top-5">
            <a href="#beranda" className="block text-slate-700 font-bold text-sm p-3 hover:bg-blue-50 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Beranda</a>
            <a href="#cek-status" className="block text-slate-700 font-bold text-sm p-3 hover:bg-blue-50 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Cek Status</a>
            <a href="#kontak" className="block text-slate-700 font-bold text-sm p-3 hover:bg-blue-50 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Kontak</a>
            <Link href="/login" className="block bg-blue-600 text-white text-center py-3 rounded-xl font-bold text-sm">Login Staff</Link>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="beranda" className="pt-32 pb-12 md:pt-52 md:pb-48 text-center relative overflow-hidden flex flex-col items-center">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="reveal active flex flex-col items-center w-full">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] md:text-sm font-bold border border-blue-100 mb-8 animate-bounce">
              SKY LAUNDRY Terpercaya 100%
            </span>

            <h1 className="text-4xl sm:text-7xl md:text-9xl font-black text-slate-900 leading-tight mb-8 tracking-tighter">
              <span className="animate-text-gradient">Cucian Bersih</span> <br />
              <span className="relative inline-block">Sebening Langit</span>
            </h1>

            <p className="text-sm sm:text-lg md:text-2xl text-slate-500 mb-14 max-w-3xl mx-auto font-medium">
              Layanan laundry premium dengan standar hotel bintang lima untuk menjaga kebersihan pakaian Anda sebersih langit biru.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#cek-status" className="btn-shimmer px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all">
                Lacak Status
              </a>
              <a href="#layanan" className="px-10 py-4 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-black text-lg hover:border-blue-300 transition-colors">
                Pilihan Paket
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- CEK STATUS SECTION --- */}
      <section id="cek-status" className="py-10 md:py-24 bg-white relative text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden reveal w-full">
            <div className="py-10 bg-gradient-to-br from-blue-600 to-blue-900 text-white relative">
              <h2 className="text-2xl md:text-6xl font-black uppercase tracking-widest">Cek Status</h2>
              <p className="text-blue-100 text-xs mt-2">Pantau cucian Anda Real-time</p>
            </div>

            <div className="p-8 -mt-8 bg-white relative z-20 mx-auto w-[90%] rounded-[2rem] shadow-lg">
              <input 
                type="text" 
                placeholder="Masukkan ID Resi (Contoh: ID-123)" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-xl font-bold focus:border-blue-500 outline-none transition-colors"
              />
              <button 
                onClick={handleCheckStatus}
                disabled={isLoading}
                className="btn-shimmer w-full mt-4 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-blue-700 transition active:scale-[0.98]"
              >
                {isLoading ? "Mencari..." : "LACAK SEKARANG"}
              </button>
            </div>

            <div className="p-10 min-h-[200px] bg-slate-50 flex items-center justify-center">
              {!searchResult && !errorMsg && (
                 <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center mb-4 shadow-sm relative">
                       <div className="radar-ring w-full h-full"></div>
                       <span className="text-2xl">🔎</span>
                    </div>
                    <p className="text-slate-400 font-bold text-xs uppercase">Hasil muncul di sini</p>
                 </div>
              )}

              {errorMsg && (
                 <div className="text-red-500 font-bold bg-red-50 px-6 py-3 rounded-xl border border-red-100 animate-pulse">
                    {errorMsg}
                 </div>
              )}

              {searchResult && (
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 w-full max-w-lg text-left animate-in fade-in zoom-in duration-300">
                   <div className="flex justify-between items-start mb-6">
                      <div>
                         <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{searchResult.id}</span>
                         <h3 className="text-2xl font-black text-slate-800 mt-2">{searchResult.customerName}</h3>
                         <p className="text-slate-500 text-sm">Layanan: {searchResult.serviceType}</p>
                      </div>
                      <div className="bg-blue-600 text-white p-3 rounded-xl">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                         <span className="text-slate-400">Status Terkini</span>
                         <span className={searchResult.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}>{searchResult.status}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                         <div className={`h-full rounded-full transition-all duration-1000 ${searchResult.status === 'COMPLETED' ? 'bg-green-500 w-full' : 'bg-yellow-400 w-1/2'}`}></div>
                      </div>
                   </div>

                   <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-slate-400 text-xs font-bold uppercase">Total Tagihan</span>
                      <span className="text-xl font-black text-blue-600">Rp {searchResult.totalPrice.toLocaleString()}</span>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- LAYANAN SECTION --- */}
      <section id="layanan" className="py-20 bg-slate-50 text-center">
        <div className="max-w-7xl mx-auto px-5">
           <div className="text-center mb-16 reveal">
              <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Layanan Kami</span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mt-2">Pilihan Terbaik</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 group reveal hover:shadow-2xl transition-all duration-500">
                 <div className="h-60 overflow-hidden relative">
                    <img src="/express.jpg" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="Express" />
                 </div>
                 <div className="p-8 text-left">
                    <h3 className="text-2xl font-extrabold text-slate-800">Ekspres</h3>
                    <p className="text-slate-500 mt-2 mb-6 text-sm">Kilat dalam hitungan jam. Solusi cerdas kebutuhan mendesak.</p>
                    <div className="pt-6 border-t border-slate-50">
                        <span className="text-2xl font-black text-blue-600">Rp 15.000</span>
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 group reveal delay-100 hover:shadow-2xl transition-all duration-500">
                 <div className="h-60 overflow-hidden relative">
                    <img src="/kiloan.jpg" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="Kiloan" />
                 </div>
                 <div className="p-8 text-left">
                    <h3 className="text-2xl font-extrabold text-slate-800">Kiloan</h3>
                    <p className="text-slate-500 mt-2 mb-6 text-sm">Hemat harian keluarga. Bersih, harum, dan rapi.</p>
                    <div className="pt-6 border-t border-slate-50">
                        <span className="text-2xl font-black text-blue-600">Rp 8.000</span>
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 group reveal delay-200 hover:shadow-2xl transition-all duration-500">
                 <div className="h-60 overflow-hidden relative">
                    <img src="/satuan.jpg" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="Satuan" />
                 </div>
                 <div className="p-8 text-left">
                    <h3 className="text-2xl font-extrabold text-slate-800">Satuan</h3>
                    <p className="text-slate-500 mt-2 mb-6 text-sm">Perawatan premium untuk jas, gaun, dan kebaya.</p>
                    <div className="pt-6 border-t border-slate-50">
                        <span className="text-2xl font-black text-blue-600">Rp 25.000</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- TENTANG SECTION (DENGAN JADWAL OPERASIONAL) --- */}
      <section className="py-20 bg-white text-center">
         <div className="max-w-6xl mx-auto px-4 reveal">
            
            {/* 1. Main Banner Image */}
            <div className="bg-blue-900 rounded-[3rem] overflow-hidden relative min-h-[600px] flex items-center justify-center group shadow-2xl">
               <img src="/tentang.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-[3s]" alt="Tentang" />
               <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent"></div>
               
               <div className="relative z-10 max-w-3xl px-6 pb-20"> {/* pb-20 agar tidak tertutup kartu jadwal */}
                  {/* Label Glass */}
                  <div className="flex justify-center mb-8">
                     <span className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-xs md:text-sm font-extrabold uppercase tracking-widest border border-white/30 shadow-lg">
                        Profil Perusahaan
                     </span>
                  </div>

                  <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase drop-shadow-2xl">SKY LAUNDRY</h2>
                  <p className="text-lg md:text-2xl text-blue-50 font-medium leading-relaxed drop-shadow-md">
                     Kami menghadirkan teknologi pencucian modern untuk menjaga serat kain Anda tetap awet sebersih langit biru.
                  </p>
               </div>
            </div>

            {/* 2. Jadwal Operasional (Floating Glass Card) */}
            <div className="relative z-20 -mt-16 px-4">
               <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-blue-100/50 transition-all duration-500">
                  
                  {/* Icon Jam */}
                  <div className="flex items-center gap-6">
                     <div className="bg-blue-600 text-white p-5 rounded-3xl shadow-lg shadow-blue-200">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <div className="text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Jadwal Operasional</p>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900">Buka Setiap Hari</h3>
                     </div>
                  </div>

                  {/* Divider (Hidden di HP) */}
                  <div className="hidden md:block w-px h-16 bg-slate-200"></div>

                  {/* Jam Buka */}
                  <div className="text-center md:text-right">
                     <p className="text-lg md:text-xl font-bold text-slate-500 mb-1">Senin - Minggu</p>
                     <p className="text-3xl md:text-5xl font-black text-blue-600 tracking-tight">07:00 - 20:00</p>
                  </div>

               </div>
            </div>

         </div>
      </section>

      {/* --- KONTAK & FOOTER (YANG TADI HILANG) --- */}
      <section id="kontak" className="py-16 md:py-32 bg-slate-50 text-center">
        <div className="max-w-7xl mx-auto px-5">
            <div className="text-center mb-16 reveal">
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Hubungi Kami</h2>
                <div className="h-1.5 w-16 bg-blue-600 mx-auto rounded-full mt-6 opacity-30"></div>
            </div>

            <div className="max-w-5xl mx-auto space-y-12">
                {/* Form Card */}
                <div className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-xl reveal text-left">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                            <input type="text" placeholder="Nama Anda" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nomor HP</label>
                            <input type="tel" placeholder="0812..." className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pesan</label>
                            <textarea rows={4} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"></textarea>
                        </div>
                        <div className="md:col-span-2 pt-4">
                            <button type="button" className="btn-shimmer w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl uppercase tracking-widest hover:bg-blue-700 transition">
                                Kirim Sekarang
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Cards Grid (Lokasi & Pickup) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 shadow-sm group hover:shadow-lg transition">
                        <div className="bg-blue-50 text-blue-500 p-5 rounded-3xl group-hover:bg-blue-500 group-hover:text-white transition-colors text-2xl">📍</div>
                        <div>
                            <h4 className="font-extrabold text-slate-900 text-xl">Lokasi Utama</h4>
                            <p className="text-slate-500">Pontianak, Kalimantan Barat</p>
                        </div>
                    </div>
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 shadow-sm group hover:shadow-lg transition">
                        <div className="bg-green-50 text-green-500 p-5 rounded-3xl group-hover:bg-green-500 group-hover:text-white transition-colors text-2xl">🚚</div>
                        <div>
                            <h4 className="font-extrabold text-slate-900 text-xl">Pickup Gratis</h4>
                            <p className="text-xs text-green-600 font-black uppercase tracking-widest">RADIUS 5 KM</p>
                        </div>
                    </div>
                </div>

                {/* Instagram Banner */}
                <div className="w-full reveal">
                    <div className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-800 p-8 md:p-12 rounded-[3rem] shadow-xl text-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner group-hover:rotate-12 transition-transform">
                                <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.979-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Ikuti Kami</p>
                                <p className="text-2xl font-black tracking-wide">SKY LAUNDRY</p>
                            </div>
                        </div>
                        <div className="mt-6 md:mt-0 relative z-10">
                            <a href="#" className="inline-flex items-center px-8 py-3 bg-white text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all shadow-lg active:scale-95">
                                Lihat Instagram
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-14 bg-white text-center border-t border-slate-100 px-5">
         <span className="text-2xl font-extrabold text-slate-900 tracking-tight block mb-2">Sky Laundry</span>
         <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em]">&copy; 2026 SKY LAUNDRY OFFICIAL. PONTIANAK.</p>
      </footer>

      {/* --- WHATSAPP FLOATING --- */}
      <a href="https://wa.me/628123456789" className="fixed bottom-8 right-8 z-[70] bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all flex items-center justify-center">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.891 11.893-11.891 3.181 0 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.481 8.412 0 6.556-5.333 11.891-11.893 11.891-2.01 0-3.987-.512-5.747-1.483l-6.246 1.692z"/></svg>
      </a>

    </main>
  );
}