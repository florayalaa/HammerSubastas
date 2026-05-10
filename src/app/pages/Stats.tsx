import { mockUserStats } from '../data/mockData';
import { BottomNav } from '../components/BottomNav';
import { TrendingUp, Award, DollarSign, Gavel, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function Stats() {
  const participationData = [
    { month: 'Oct', subastas: 3 },
    { month: 'Nov', subastas: 5 },
    { month: 'Dic', subastas: 2 },
    { month: 'Ene', subastas: 4 },
    { month: 'Feb', subastas: 6 },
    { month: 'Mar', subastas: 3 },
  ];

  const categoryData = [
    { name: 'Arte', value: 40 },
    { name: 'Antigüedades', value: 30 },
    { name: 'Joyería', value: 20 },
    { name: 'Otros', value: 10 },
  ];

  const COLORS = ['#6A4F99', '#C9A063', '#A08C79', '#6A4F99'];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-white p-6 rounded-b-3xl shadow-lg mb-6">
        <h2 className="text-2xl mb-2">Estadísticas</h2>
        <p className="text-sm opacity-90">Tu actividad en subastas</p>
      </div>

      {/* Key Metrics */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <Gavel className="text-primary" size={24} />
            </div>
            <p className="text-2xl text-foreground mb-1">{mockUserStats.totalAuctions}</p>
            <p className="text-xs text-gray-500">Subastas participadas</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <Award className="text-secondary" size={24} />
            </div>
            <p className="text-2xl text-foreground mb-1">{mockUserStats.itemsWon}</p>
            <p className="text-xs text-gray-500">Artículos ganados</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <p className="text-2xl text-foreground mb-1">{mockUserStats.totalBids}</p>
            <p className="text-xs text-gray-500">Pujas realizadas</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <p className="text-2xl text-foreground mb-1">{mockUserStats.winRate.toFixed(1)}%</p>
            <p className="text-xs text-gray-500">Tasa de éxito</p>
          </div>
        </div>
      </div>

      {/* Total Invested */}
      <div className="px-6 mb-6">
        <div className="bg-gradient-to-br from-primary to-purple-700 text-white rounded-xl shadow-md p-6">
          <p className="text-sm opacity-90 mb-2">Total invertido</p>
          <p className="text-3xl mb-1">USD {mockUserStats.totalSpent.toLocaleString()}</p>
          <p className="text-xs opacity-75">En {mockUserStats.itemsWon} artículos adquiridos</p>
        </div>
      </div>

      {/* Participation Over Time */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-foreground mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Participación mensual
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={participationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="subastas" fill="#6A4F99" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Categories Distribution */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-foreground mb-4">Categorías de interés</h3>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="50%" height={150}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <span className="text-sm text-gray-500 ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 mb-6">
        <h3 className="text-foreground mb-4">Actividad reciente</h3>
        <div className="space-y-3">
          {[
            {
              date: '2026-03-16',
              action: 'Ganaste una puja',
              item: 'Composición Abstracta',
              amount: 18500,
            },
            {
              date: '2026-03-10',
              action: 'Participaste en subasta',
              item: 'Reloj de Bolsillo Vintage',
              amount: null,
            },
            {
              date: '2026-03-05',
              action: 'Ganaste una puja',
              item: 'Escultura en Mármol',
              amount: 22000,
            },
          ].map((activity, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-foreground mb-1">{activity.action}</p>
                  <p className="text-xs text-gray-600 mb-2">{activity.item}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.date).toLocaleDateString('es-AR')}
                  </p>
                </div>
                {activity.amount && (
                  <div className="text-right">
                    <p className="text-sm text-green-600">
                      USD {activity.amount.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}