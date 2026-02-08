"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X } from 'lucide-react'; // Hapus RefreshCw yang tidak dipakai

// ... interface Order tetap sama ...
interface Order {
  id: string;
  customerName: string;
  weight: number;
  serviceType: string;
  status: string;
  totalPrice: number;
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    weight: 0,
    serviceType: 'KILOAN'
  });

  // PERBAIKAN DI SINI:
  // Kita buat fungsi fetchOrders agar bisa dipanggil ulang
  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:4000/orders');
      setOrders(res.data);
   } catch (_) { // Ganti err jadi underscore
    console.error("Gagal ambil data");
   }
  };

  // Panggil saat komponen pertama kali dimuat
  useEffect(() => {
    fetchOrders(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Handle Submit Pesanan Baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/orders', {
        ...formData,
        weight: Number(formData.weight)
      });
      setIsModalOpen(false);
      setFormData({ customerName: '', weight: 0, serviceType: 'KILOAN' });
      
      // Refresh tabel setelah submit sukses
      fetchOrders(); 
      alert('Pesanan berhasil dibuat!');
    } catch (err) {
      alert('Gagal membuat pesanan');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Dashboard */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Dashboard Laundry</h1>
            <p className="text-gray-500">Kelola pesanan masuk dan status cucian</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition"
          >
            <Plus size={20} /> Tambah Pesanan
          </button>
        </div>

        {/* Tabel Pesanan */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="p-4">ID Resi</th>
                <th className="p-4">Pelanggan</th>
                <th className="p-4">Layanan</th>
                <th className="p-4">Berat (Kg)</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-blue-50 transition">
                  <td className="p-4 font-mono text-xs text-gray-500">{order.id.slice(0, 8)}...</td>
                  <td className="p-4 font-bold text-gray-800">{order.customerName}</td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                      {order.serviceType}
                    </span>
                  </td>
                  <td className="p-4">{order.weight} Kg</td>
                  <td className="p-4">Rp {order.totalPrice.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                     <button className="text-blue-600 hover:underline text-xs">Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {orders.length === 0 && (
            <div className="p-8 text-center text-gray-400">Belum ada pesanan masuk.</div>
          )}
        </div>

      </div>

      {/* --- MODAL TAMBAH PESANAN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">Input Pesanan Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pelanggan</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Berat (Kg)</label>
                  <input 
                    required
                    type="number" 
                    step="0.1"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Layanan</label>
                  <select 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  >
                    <option value="KILOAN">Kiloan Regular</option>
                    <option value="EXPRESS">Express Kilat</option>
                    <option value="SATUAN">Satuan</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition">
                  SIMPAN PESANAN
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}