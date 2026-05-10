export function DashboardWireframe() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="w-32 h-8 bg-black"></div>
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="w-20 h-8 border-2 border-black hidden md:block"></div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-black"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="w-64 h-10 bg-black mb-2"></div>
          <div className="w-48 h-5 bg-gray-400"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((stat) => (
            <div key={stat} className="bg-white border-2 border-black p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-900 rounded"></div>
                <div className="w-6 h-6 bg-gray-400"></div>
              </div>
              <div className="w-20 h-8 bg-black mb-2"></div>
              <div className="w-32 h-4 bg-gray-400"></div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Active Auctions */}
          <div className="bg-white border-2 border-black p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="w-40 h-6 bg-black"></div>
              <div className="w-20 h-6 border-2 border-black px-2"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border-2 border-gray-300 p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-300 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="w-full h-5 bg-black mb-2"></div>
                      <div className="w-3/4 h-4 bg-gray-400 mb-2"></div>
                      <div className="flex gap-2">
                        <div className="w-16 h-6 border border-black"></div>
                        <div className="w-16 h-6 border border-black"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border-2 border-black p-6">
            <div className="w-40 h-6 bg-black mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-start gap-3 pb-4 border-b border-gray-300">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="w-full h-4 bg-black mb-2"></div>
                    <div className="w-2/3 h-3 bg-gray-400 mb-1"></div>
                    <div className="w-24 h-3 bg-gray-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Auctions */}
        <div className="bg-white border-2 border-black p-6">
          <div className="w-48 h-6 bg-black mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-2 border-gray-300">
                <div className="w-full h-40 bg-gray-300"></div>
                <div className="p-4">
                  <div className="w-full h-5 bg-black mb-2"></div>
                  <div className="w-3/4 h-4 bg-gray-400 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="w-20 h-4 bg-gray-400"></div>
                    <div className="w-16 h-8 border-2 border-black"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black">
        <div className="flex justify-around py-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex flex-col items-center">
              <div className="w-6 h-6 bg-gray-400 mb-1"></div>
              <div className="w-12 h-2 bg-gray-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
