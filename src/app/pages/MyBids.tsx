import { Calendar, TrendingUp, Award, DollarSign, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState } from "react";

export function MyBids() {
  const [filterStatus, setFilterStatus] = useState("all");

  const stats = [
    { label: "Total Participaciones", value: "45", icon: TrendingUp, color: "bg-[#6A4F99]" },
    { label: "Subastas Ganadas", value: "8", icon: Award, color: "bg-[#C9A063]" },
    { label: "Total Invertido", value: "$125,400", icon: DollarSign, color: "bg-[#A08C79]" },
    { label: "Tasa de Éxito", value: "17.8%", icon: TrendingUp, color: "bg-[#A08C79]" },
  ];

  const bidHistory = [
    {
      id: 1,
      item: "Reloj Patek Philippe 1942",
      auction: "Colección de Relojes",
      date: "15 Mar 2026",
      myBid: "$45,000",
      finalPrice: "$48,500",
      status: "won",
      category: "Platino",
    },
    {
      id: 2,
      item: "Collar de Esmeraldas Art Déco",
      auction: "Joyería Vintage",
      date: "14 Mar 2026",
      myBid: "$28,500",
      finalPrice: "$32,000",
      status: "lost",
      category: "Oro",
    },
    {
      id: 3,
      item: "Pintura Abstracta Moderna",
      auction: "Arte Contemporáneo",
      date: "12 Mar 2026",
      myBid: "$15,200",
      finalPrice: "$15,200",
      status: "won",
      category: "Oro",
    },
    {
      id: 4,
      item: "Escultura de Bronce",
      auction: "Arte Contemporáneo",
      date: "10 Mar 2026",
      myBid: "$8,500",
      finalPrice: "$12,000",
      status: "lost",
      category: "Plata",
    },
    {
      id: 5,
      item: "Anillo de Zafiro Victorian",
      auction: "Joyería Histórica",
      date: "8 Mar 2026",
      myBid: "$22,000",
      finalPrice: "$22,000",
      status: "won",
      category: "Oro",
    },
  ];

  const monthlyData = [
    { month: "Ene", invertido: 12000, ganado: 3 },
    { month: "Feb", invertido: 18500, ganado: 2 },
    { month: "Mar", invertido: 25400, ganado: 3 },
  ];

  const categoryData = [
    { name: "Joyería", value: 45, color: "#6A4F99" },
    { name: "Arte", value: 30, color: "#C9A063" },
    { name: "Relojes", value: 15, color: "#A08C79" },
    { name: "Otros", value: 10, color: "#E2C3BC" },
  ];

  const filteredBids = bidHistory.filter((bid) => {
    if (filterStatus === "all") return true;
    return bid.status === filterStatus;
  });

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#333F48] mb-2">Mis Pujas</h1>
          <p className="text-[#A08C79]">Historial completo de participaciones y estadísticas</p>
        </div>

        {/* Stats Grid - Total Participaciones y Subastas Ganadas */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {stats.slice(0, 2).map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="text-white" size={20} />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#333F48] mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-[#A08C79]">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Stats Grid - Total Invertido y Tasa de Éxito */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
          {stats.slice(2, 4).map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="text-white" size={20} />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#333F48] mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-[#A08C79]">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Investment Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-[#333F48] mb-6">Inversión Mensual</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#A08C79" />
                <YAxis stroke="#A08C79" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #C9A063",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="invertido" fill="#6A4F99" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-[#333F48] mb-6">Distribución por Categoría</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bid History */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-bold text-[#333F48]">Historial de Pujas</h2>
              <div className="flex items-center gap-2">
                <Filter className="text-[#A08C79]" size={20} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">Todas</option>
                  <option value="won">Ganadas</option>
                  <option value="lost">Perdidas</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#A08C79] uppercase tracking-wider">
                    Artículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#A08C79] uppercase tracking-wider">
                    Subasta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#A08C79] uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#A08C79] uppercase tracking-wider">
                    Mi Puja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#A08C79] uppercase tracking-wider">
                    Precio Final
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#A08C79] uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#A08C79] uppercase tracking-wider">
                    Categoría
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBids.map((bid) => (
                  <tr key={bid.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-[#333F48]">{bid.item}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#A08C79]">
                      {bid.auction}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-[#A08C79]">
                        <Calendar size={14} />
                        {bid.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#333F48]">
                      {bid.myBid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#333F48]">
                      {bid.finalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bid.status === "won" ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                          <Award size={14} />
                          Ganada
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium w-fit">
                          Perdida
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {bid.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBids.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-[#A08C79]">No se encontraron pujas con este filtro</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}