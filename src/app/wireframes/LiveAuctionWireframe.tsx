export function LiveAuctionWireframe() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-400"></div>
            <div className="w-20 h-4 bg-gray-400"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-black"></div>
            <div className="w-20 h-6 border-2 border-black px-2"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Card */}
            <div className="bg-white border-2 border-black">
              <div className="md:flex">
                {/* Product Image */}
                <div className="md:w-1/3 h-64 md:h-auto bg-gray-300 border-b-2 md:border-b-0 md:border-r-2 border-black"></div>

                {/* Product Details */}
                <div className="md:w-2/3 p-6">
                  <div className="w-20 h-4 bg-gray-400 mb-2"></div>
                  <div className="w-5/6 h-8 bg-black mb-4"></div>
                  <div className="w-full h-4 bg-gray-300 mb-2"></div>
                  <div className="w-4/5 h-4 bg-gray-300 mb-6"></div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="w-24 h-4 bg-gray-400 mb-2"></div>
                      <div className="w-32 h-6 bg-black"></div>
                    </div>
                    <div>
                      <div className="w-32 h-4 bg-gray-400 mb-2"></div>
                      <div className="w-20 h-6 bg-black"></div>
                    </div>
                  </div>

                  {/* Current Bid Display */}
                  <div className="bg-gray-900 text-white p-4 border-2 border-black">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="w-24 h-3 bg-gray-400 mb-2"></div>
                        <div className="w-40 h-10 bg-white"></div>
                      </div>
                      <div className="w-8 h-8 bg-white"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Bidding */}
          <div className="space-y-6">
            {/* Bid Form */}
            <div className="bg-white border-2 border-black p-6">
              <div className="w-32 h-6 bg-black mb-6"></div>

              {/* Info Alert */}
              <div className="border-2 border-gray-400 bg-gray-100 p-3 mb-4">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-gray-400 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="w-full h-3 bg-gray-400 mb-2"></div>
                    <div className="w-3/4 h-3 bg-gray-400"></div>
                  </div>
                </div>
              </div>

              {/* Bid Amount Label */}
              <div className="mb-4">
                <div className="w-48 h-5 bg-black mb-3"></div>

                {/* Slider */}
                <div className="relative">
                  <div className="w-full h-2 bg-gray-300 rounded"></div>
                  <div className="absolute top-0 w-1/2 h-2 bg-black rounded"></div>
                  <div className="absolute top-0 left-1/2 w-4 h-4 -mt-1 bg-black rounded-full border-2 border-white"></div>
                </div>

                {/* Min/Max Labels */}
                <div className="flex justify-between mt-2">
                  <div className="w-24 h-3 bg-gray-400"></div>
                  <div className="w-24 h-3 bg-gray-400"></div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="w-full h-12 bg-black mb-4"></div>

              {/* Quick Bid Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <div className="h-10 border-2 border-black"></div>
                <div className="h-10 border-2 border-black"></div>
                <div className="h-10 border-2 border-black"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Info Bar (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="w-24 h-3 bg-gray-400 mb-1"></div>
            <div className="w-32 h-6 bg-black"></div>
          </div>
          <div className="w-24 h-10 bg-black"></div>
        </div>
      </div>
    </div>
  );
}
