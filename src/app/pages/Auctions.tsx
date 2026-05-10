import { Link } from "react-router";
import { Search, Filter, Calendar, Users, DollarSign, Lock } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function Auctions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCurrency, setSelectedCurrency] = useState("all");
  const { isAuthenticated } = useAuth();

  const auctions = [
    {
      id: 1,
      title: "Subasta de Arte Contemporáneo",
      date: "18 de Marzo, 2026",
      dateObj: new Date("2026-03-18T18:00:00"),
      time: "18:00",
      location: "Buenos Aires, Argentina",
      category: "Oro",
      currency: "USD",
      items: 24,
      startingBid: "$5,000",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1609166816663-3dff820fc5fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhdWN0aW9uJTIwYXJ0JTIwZ2FsbGVyeXxlbnwxfHx8fDE3NzM3MDc1MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 2,
      title: "Colección de Relojes de Lujo",
      date: "19 de Marzo, 2026",
      dateObj: new Date("2026-03-19T20:00:00"),
      time: "20:00",
      location: "Montevideo, Uruguay",
      category: "Platino",
      currency: "USD",
      items: 18,
      startingBid: "$15,000",
      status: "live",
      image: "https://images.unsplash.com/photo-1759910546811-8d9df1501688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwd2F0Y2glMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc3MzcwNzUyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 3,
      title: "Joyería Vintage Exclusiva",
      date: "20 de Marzo, 2026",
      dateObj: new Date("2026-03-20T19:00:00"),
      time: "19:00",
      location: "Santiago, Chile",
      category: "Plata",
      currency: "ARS",
      items: 32,
      startingBid: "$3,500",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1721103428182-89ba395d44bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwamV3ZWxyeSUyMGRpYW1vbmRzfGVufDF8fHx8MTc3MzcwNzUyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 4,
      title: "Pintura Clásica Europea",
      date: "22 de Marzo, 2026",
      dateObj: new Date("2026-03-22T17:00:00"),
      time: "17:00",
      location: "Madrid, España",
      category: "Oro",
      currency: "USD",
      items: 15,
      startingBid: "$25,000",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1637578036198-7e5ac44f9ed9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwcGFpbnRpbmclMjBtdXNldW18ZW58MXx8fHwxNzczNzA3NTIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  const filteredAuctions = auctions
    .filter((auction) => {
      const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || auction.category === selectedCategory;
      const matchesCurrency = selectedCurrency === "all" || auction.currency === selectedCurrency;
      return matchesSearch && matchesCategory && matchesCurrency;
    })
    .sort((a, b) => {
      // Primero: priorizar subastas en vivo
      if (a.status === "live" && b.status !== "live") return -1;
      if (a.status !== "live" && b.status === "live") return 1;

      // Segundo: ordenar por fecha (más próxima primero)
      return a.dateObj.getTime() - b.dateObj.getTime();
    });

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#333F48] mb-2">Subastas Disponibles</h1>
          <p className="text-[#A08C79]">Explora todas las subastas activas y próximas</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm text-[#333F48]">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08C79]" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar subastas..."
                  className="w-full pl-10 pr-4 py-2 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block mb-2 text-sm text-[#333F48]">Categoría</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08C79]" size={20} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="all">Todas</option>
                  <option value="Común">Común</option>
                  <option value="Especial">Especial</option>
                  <option value="Plata">Plata</option>
                  <option value="Oro">Oro</option>
                  <option value="Platino">Platino</option>
                </select>
              </div>
            </div>

            {/* Currency Filter */}
            <div>
              <label className="block mb-2 text-sm text-[#333F48]">Moneda</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08C79]" size={20} />
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="all">Todas</option>
                  <option value="USD">USD</option>
                  <option value="ARS">ARS</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-[#A08C79]">
            Mostrando <span className="font-semibold text-[#333F48]">{filteredAuctions.length}</span> subastas
          </p>
        </div>

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAuctions.map((auction) => (
            <div
              key={auction.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow group"
            >
              <div className="md:flex">
                <div className="md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden">
                  <ImageWithFallback
                    src={auction.image}
                    alt={auction.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="md:w-3/5 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {auction.status === "live" && (
                      <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        EN VIVO
                      </span>
                    )}
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                      {auction.category}
                    </span>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs">
                      {auction.currency}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#333F48] mb-3">
                    {auction.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-[#A08C79]">
                      <Calendar size={16} />
                      <span>{auction.date} • {auction.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#A08C79]">
                      <Users size={16} />
                      <span>{auction.items} artículos</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#A08C79]">
                      <DollarSign size={16} />
                      {isAuthenticated ? (
                        <span>Desde {auction.startingBid}</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Lock size={14} />
                          <Link to="/login" className="text-primary hover:underline">
                            Inicia sesión
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/auctions/${auction.id}`}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-center"
                    >
                      Ver Catálogo
                    </Link>
                    {auction.status === "live" && (
                      <Link
                        to={`/auctions/${auction.id}/live`}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-center"
                      >
                        Participar
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAuctions.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <p className="text-[#A08C79] text-lg">No se encontraron subastas que coincidan con tu búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}
