'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LineChart, Search, Filter, RotateCcw, LogOut, 
  CheckCircle, AlertCircle, Trash2, Package, Calendar, 
  Plus, X, Edit, Save, Loader2, Clock, Printer, DollarSign 
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// --- TIPE DATA ---
interface Order {
  id: string; 
  orderId: string;
  customerName: string;
  serviceType: 'KILOAN' | 'SATUAN' | 'EXPRESS';
  weight: number;
  totalPrice: number;
  status: 'PENDING' | 'WASHING' | 'IRONING' | 'READY' | 'COMPLETED';
  isPaid: boolean; // FIELD BARU
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // State Modal & Print
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // State Struk
  const [printData, setPrintData] = useState<Order | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Form Data Default
  const initialForm = {
    customerName: '',
    serviceType: 'KILOAN', 
    weight: 1,
    status: 'PENDING',
    isPaid: false // Default Belum Bayar
  };
  const [formData, setFormData] = useState(initialForm);

  // --- 1. FETCH DATA ---
  const fetchOrders = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return router.push('/staff-login');

    try {
      const res = await fetch('http://localhost:4000/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('accessToken');
          router.push('/staff-login');
        }
        throw new Error('Gagal mengambil data');
      }

      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [router]);

  // --- 2. PRINT FUNCTION ---
  const handlePrint = (order: Order) => {
    setPrintData(order);
    // Tunggu sebentar agar state terupdate ke DOM, lalu print
    setTimeout(() => {
        window.print();
    }, 100);
  };

  // --- 3. SUBMIT HANDLE ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('accessToken');

    try {
      const url = isEditing 
        ? `http://localhost:4000/orders/${editId}` 
        : 'http://localhost:4000/orders';
      
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");
      
      const savedData = await res.json(); // Data yang baru disimpan

      await fetchOrders();
      closeModal();
      
      // JIKA INPUT BARU: Tawarkan Cetak Struk
      if (!isEditing) {
        if(confirm("Pesanan berhasil! Cetak struk sekarang?")) {
            // Kita butuh data lengkap (termasuk orderId yg digenerate backend)
            // savedData biasanya sudah berisi data lengkap dari backend
            handlePrint(savedData); 
        }
      } else {
        alert("Data berhasil diperbarui!");
      }

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  // --- 4. TOGGLE PAYMENT STATUS ---
  const togglePayment = async (order: Order) => {
    const token = localStorage.getItem('accessToken');
    const newStatus = !order.isPaid;
    const confirmMsg = newStatus ? "Tandai pesanan ini sebagai LUNAS?" : "Batalkan status lunas?";
    
    if(!confirm(confirmMsg)) return;

    try {
        await fetch(`http://localhost:4000/orders/${order.id}`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ isPaid: newStatus })
        });
        fetchOrders();
    } catch (error) { console.error(error); }
  };

  // --- ACTIONS LAIN ---
  const handleDelete = async (id: string) => {
    if(!confirm("Hapus pesanan ini secara permanen?")) return;
    const token = localStorage.getItem('accessToken');
    try {
      await fetch(`http://localhost:4000/orders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchOrders();
    } catch (error) { console.error(error); }
  };

  const markAsCompleted = async (id: string) => {
    const token = localStorage.getItem('accessToken');
    try {
      await fetch(`http://localhost:4000/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'COMPLETED' })
      });
      fetchOrders();
    } catch (error) { console.error(error); }
  };

  // --- UI HELPERS ---
  const openCreateModal = () => {
    setIsEditing(false); setEditId(null); setFormData(initialForm); setShowModal(true);
  };

  const openEditModal = (order: Order) => {
    setIsEditing(true); setEditId(order.id);
    setFormData({
      customerName: order.customerName,
      serviceType: order.serviceType,
      weight: order.weight,
      status: order.status,
      isPaid: order.isPaid
    });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setSaving(false); };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchSearch = order.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          order.orderId.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' ? true : order.status === statusFilter;
      const matchDate = dateFilter ? order.createdAt.startsWith(dateFilter) : true;
      return matchSearch && matchStatus && matchDate;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, search, statusFilter, dateFilter]);

  const stats = useMemo(() => ({
    income: orders.filter(o => o.status === 'COMPLETED').reduce((acc, curr) => acc + curr.totalPrice, 0),
    pending: orders.filter(o => o.status !== 'COMPLETED').reduce((acc, curr) => acc + curr.totalPrice, 0),
    countDone: orders.filter(o => o.status === 'COMPLETED').length,
    countPending: orders.filter(o => o.status !== 'COMPLETED').length
  }), [orders]);

  const chartData = {
    labels: filteredOrders.slice(0, 7).map(o => new Date(o.createdAt).toLocaleDateString('id-ID', {day: '2-digit', month: 'short'})).reverse(),
    datasets: [{
      label: 'Omzet',
      data: filteredOrders.slice(0, 7).map(o => o.totalPrice).reverse(),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'PENDING': return 'bg-slate-100 text-slate-600';
        case 'WASHING': return 'bg-blue-100 text-blue-600';
        case 'IRONING': return 'bg-amber-100 text-amber-600';
        case 'READY': return 'bg-purple-100 text-purple-600';
        case 'COMPLETED': return 'bg-emerald-100 text-emerald-600';
        default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-[family-name:var(--font-jakarta)] relative print:p-0 print:bg-white">
      
      {/* --- STRUK PRINT AREA (Hanya Muncul saat Print) --- */}
      <div className="hidden print:block print:w-[300px] print:mx-auto print:text-black print:font-mono p-4" ref={printRef}>
        {printData && (
            <div className="text-center border-b-2 border-dashed border-black pb-4 mb-4">
                <h1 className="text-xl font-black uppercase">Sky Laundry</h1>
                <p className="text-xs">Jl. Merdeka No. 1, Pontianak</p>
                <p className="text-xs">WA: 0812-3456-7890</p>
                <br/>
                <div className="text-left text-xs space-y-1">
                    <p>No. Order : <strong>{printData.orderId}</strong></p>
                    <p>Tanggal   : {new Date().toLocaleDateString('id-ID')}</p>
                    <p>Pelanggan : {printData.customerName}</p>
                </div>
                <br/>
                <div className="border-t border-b border-black py-2 text-left text-xs">
                    <div className="flex justify-between font-bold">
                        <span>{printData.serviceType} ({printData.weight}kg)</span>
                        <span>Rp {printData.totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                </div>
                <br/>
                <div className="text-right text-sm font-black">
                    TOTAL: Rp {printData.totalPrice.toLocaleString('id-ID')}
                </div>
                <div className="text-center text-xs mt-4">
                    STATUS: {printData.isPaid ? 'LUNAS' : 'BELUM LUNAS'}
                </div>
                <div className="text-center text-[10px] mt-4 italic">
                    Terima kasih telah mempercayakan<br/>cucian Anda kepada kami!
                </div>
            </div>
        )}
      </div>

      {/* --- DASHBOARD CONTENT (Disembunyikan saat Print) --- */}
      <div className="print:hidden">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div>
            <h1 className="text-3xl md:text-4xl font-black text-blue-600 flex items-center gap-3">
                Sky Laundry <span className="text-slate-300 font-light text-xl">Dashboard</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Panel Kontrol Admin & Staff</p>
            </div>
            <div className="flex gap-3">
            <button onClick={openCreateModal} className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-200 active:scale-95">
                <Plus size={20} /> Input Pesanan
            </button>
            <button onClick={() => { localStorage.removeItem('accessToken'); router.push('/staff-login'); }} className="bg-white border border-red-100 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl font-bold transition-all shadow-sm">
                <LogOut size={20} />
            </button>
            </div>
        </header>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {/* Stats Cards sama seperti sebelumnya... */}
            <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg shadow-blue-200">
            <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-2">Total Omzet</p>
            <h3 className="text-3xl font-black">Rp {stats.income.toLocaleString('id-ID')}</h3>
            </div>
            {/* ... card lainnya ... */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Potensi (Pending)</p>
            <h3 className="text-3xl font-black text-amber-500">Rp {stats.pending.toLocaleString('id-ID')}</h3>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Order Selesai</p>
            <h3 className="text-3xl font-black text-emerald-600">{stats.countDone}</h3>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Dalam Proses</p>
            <h3 className="text-3xl font-black text-blue-600">{stats.countPending}</h3>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
                <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Cari ID / Nama..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none outline-none font-medium text-slate-700" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-3 bg-slate-50 rounded-2xl border-none outline-none font-medium text-slate-700 cursor-pointer">
                <option value="all">Semua Status</option>
                <option value="PENDING">Pending</option>
                <option value="WASHING">Cuci</option>
                <option value="IRONING">Setrika</option>
                <option value="READY">Siap Ambil</option>
                <option value="COMPLETED">Selesai</option>
                </select>
                <button onClick={() => {setSearch(''); setStatusFilter('all'); setDateFilter('');}} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><RotateCcw size={20} /></button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th className="py-5 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Order ID</th>
                        <th className="py-5 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Pelanggan</th>
                        <th className="py-5 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider text-center">Info</th>
                        <th className="py-5 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider text-center">Pembayaran</th>
                        <th className="py-5 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider text-center">Status</th>
                        <th className="py-5 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider text-center">Aksi</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {filteredOrders.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-10 text-slate-400 italic">Tidak ada data ditemukan</td></tr>
                    ) : (
                        filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                            <td className="py-4 px-6"><span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{order.orderId}</span></td>
                            <td className="py-4 px-6">
                            <p className="font-bold text-slate-700">{order.customerName}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                            </td>
                            <td className="py-4 px-6 text-center">
                            <div className="font-bold text-slate-600 text-sm">{order.serviceType}</div>
                            <div className="text-[10px] text-blue-500 font-bold">{order.weight} Kg • Rp {order.totalPrice.toLocaleString('id-ID')}</div>
                            </td>
                            {/* KOLOM PEMBAYARAN BARU */}
                            <td className="py-4 px-6 text-center">
                                <button onClick={() => togglePayment(order)} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${order.isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'}`}>
                                    {order.isPaid ? 'LUNAS' : 'BELUM BAYAR'}
                                </button>
                            </td>
                            <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                {order.status === 'COMPLETED' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                {order.status}
                            </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                                {/* Tombol Print Struk */}
                                <button onClick={() => handlePrint(order)} className="p-2 bg-slate-800 text-white rounded-full hover:bg-slate-900 transition-all shadow-sm" title="Cetak Struk">
                                    <Printer size={16} />
                                </button>
                                {order.status !== 'COMPLETED' && (
                                <button onClick={() => markAsCompleted(order.id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-500 hover:text-white transition-all shadow-sm" title="Selesai">
                                    <CheckCircle size={16} />
                                </button>
                                )}
                                <button onClick={() => openEditModal(order)} className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-blue-500 hover:text-white transition-all shadow-sm" title="Edit">
                                <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(order.id)} className="p-2 bg-red-50 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                <Trash2 size={16} />
                                </button>
                            </div>
                            </td>
                        </tr>
                        ))
                    )}
                    </tbody>
                </table>
                </div>
            </div>
            </div>

            <div className="space-y-8">
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-xl">
                <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2"><LineChart size={20} className="text-blue-600" /> Tren Transaksi</h3>
                <div className="h-64"><Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { display: false }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }} /></div>
            </div>
            </div>
        </div>

        {/* --- MODAL --- */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                    {isEditing ? <Edit className="text-blue-600" /> : <Plus className="text-blue-600" />}
                    {isEditing ? 'Update Pesanan' : 'Input Pesanan Baru'}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24} className="text-slate-400" /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Pelanggan</label>
                    <input type="text" required value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-700 transition-all" placeholder="Contoh: Budi Santoso" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Berat (Kg)</label>
                    <input type="number" step="0.1" min="0.1" required value={formData.weight} onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-700 transition-all text-center" />
                    </div>
                    <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Layanan</label>
                    <select value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-700 transition-all appearance-none cursor-pointer">
                        <option value="KILOAN">Cuci Kiloan</option>
                        <option value="SATUAN">Cuci Satuan</option>
                        <option value="EXPRESS">Express</option>
                    </select>
                    </div>
                </div>

                {/* TOGGLE BAYAR */}
                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 flex items-center justify-between cursor-pointer" onClick={() => setFormData({...formData, isPaid: !formData.isPaid})}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.isPaid ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-700 text-sm">Status Pembayaran</p>
                            <p className="text-xs text-slate-400">{formData.isPaid ? 'Pesanan LUNAS' : 'Belum dibayar'}</p>
                        </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.isPaid ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${formData.isPaid ? 'translate-x-6' : ''}`}></div>
                    </div>
                </div>

                {isEditing && (
                    <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Update Status</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['PENDING', 'WASHING', 'IRONING', 'READY', 'COMPLETED'].map((s) => (
                        <button key={s} type="button" onClick={() => setFormData({...formData, status: s})} className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all ${formData.status === s ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300'}`}>{s}</button>
                        ))}
                    </div>
                    </div>
                )}
                <button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-4">
                    {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {isEditing ? 'Simpan Perubahan' : 'Buat Pesanan & Cetak'}
                </button>
                </form>
            </div>
            </div>
        )}
      </div>
    </main>
  );
}