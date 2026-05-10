export function HomeWireframe() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="w-32 h-8 bg-black"></div>
          <div className="flex gap-4">
            <div className="w-24 h-10 border-2 border-black"></div>
            <div className="w-24 h-10 bg-black"></div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="w-3/4 h-12 bg-black mx-auto mb-4"></div>
          <div className="w-1/2 h-6 bg-gray-400 mx-auto mb-8"></div>
          <div className="w-40 h-12 bg-black mx-auto"></div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="w-64 h-10 bg-black mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="border-2 border-black p-6">
              <div className="w-12 h-12 bg-gray-400 mb-4"></div>
              <div className="w-32 h-6 bg-black mb-2"></div>
              <div className="w-full h-4 bg-gray-300 mb-2"></div>
              <div className="w-3/4 h-4 bg-gray-300"></div>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-gray-100 border-y-2 border-black py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-48 h-10 bg-black mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 rounded-full border-4 border-black mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-black"></div>
                </div>
                <div className="w-32 h-6 bg-black mx-auto mb-2"></div>
                <div className="w-full h-4 bg-gray-400 mx-auto mb-1"></div>
                <div className="w-3/4 h-4 bg-gray-400 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-black bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div className="space-y-2">
              <div className="w-24 h-6 bg-white mb-4"></div>
              <div className="w-32 h-4 bg-gray-400"></div>
              <div className="w-32 h-4 bg-gray-400"></div>
              <div className="w-32 h-4 bg-gray-400"></div>
            </div>
            <div className="space-y-2">
              <div className="w-24 h-6 bg-white mb-4"></div>
              <div className="w-32 h-4 bg-gray-400"></div>
              <div className="w-32 h-4 bg-gray-400"></div>
              <div className="w-32 h-4 bg-gray-400"></div>
            </div>
            <div className="space-y-2">
              <div className="w-24 h-6 bg-white mb-4"></div>
              <div className="w-32 h-4 bg-gray-400"></div>
              <div className="w-32 h-4 bg-gray-400"></div>
            </div>
          </div>
          <div className="text-center border-t border-gray-600 pt-6">
            <div className="w-64 h-4 bg-gray-400 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
