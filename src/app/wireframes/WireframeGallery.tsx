import { useState } from 'react';
import { HomeWireframe } from './HomeWireframe';
import { LoginWireframe } from './LoginWireframe';
import { DashboardWireframe } from './DashboardWireframe';
import { AuctionsWireframe } from './AuctionsWireframe';
import { LiveAuctionWireframe } from './LiveAuctionWireframe';

export function WireframeGallery() {
  const [activeWireframe, setActiveWireframe] = useState('home');

  const wireframes = [
    { id: 'home', name: 'Home', component: HomeWireframe },
    { id: 'login', name: 'Login', component: LoginWireframe },
    { id: 'dashboard', name: 'Dashboard', component: DashboardWireframe },
    { id: 'auctions', name: 'Subastas', component: AuctionsWireframe },
    { id: 'live', name: 'Subasta en Vivo', component: LiveAuctionWireframe },
  ];

  const ActiveComponent = wireframes.find(w => w.id === activeWireframe)?.component || HomeWireframe;

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Navigation */}
      <div className="bg-black text-white p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Wireframes - HAMMER Subastas</h1>
          <div className="flex flex-wrap gap-2">
            {wireframes.map((wireframe) => (
              <button
                key={wireframe.id}
                onClick={() => setActiveWireframe(wireframe.id)}
                className={`px-4 py-2 border-2 border-white transition-colors ${
                  activeWireframe === wireframe.id
                    ? 'bg-white text-black'
                    : 'bg-black text-white hover:bg-white hover:text-black'
                }`}
              >
                {wireframe.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wireframe Display */}
      <div className="bg-white">
        <ActiveComponent />
      </div>
    </div>
  );
}
