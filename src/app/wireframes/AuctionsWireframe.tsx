export function AuctionsWireframe() {
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

      {/* Page Header */}
      <div className="bg-white border-b-2 border-black py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-48 h-10 bg-black mb-4"></div>
          <div className="w-64 h-5 bg-gray-400"></div>
        </div>
      </div>

      {/* Filters and Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-black p-6 sticky top-4">
              <div className="w-24 h-6 bg-black mb-6"></div>

              {/* Category Filter */}
              <div className="mb-6">
                <div className="w-32 h-5 bg-black mb-3"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black"></div>
                      <div className="w-24 h-4 bg-gray-400"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <div className="w-32 h-5 bg-black mb-3"></div>
                <div className="w-full h-2 bg-gray-300 mb-3"></div>
                <div className="flex gap-2">
                  <div className="w-1/2 h-10 border-2 border-black"></div>
                  <div className="w-1/2 h-10 border-2 border-black"></div>
                </div>
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <div className="w-32 h-5 bg-black mb-3"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black"></div>
                      <div className="w-20 h-4 bg-gray-400"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <div className="w-full h-10 bg-black"></div>
            </div>
          </div>

          {/* Auctions Grid */}
          <div className="lg:col-span-3">
            {/* Sort and View Options */}
            <div className="bg-white border-2 border-black p-4 mb-6 flex items-center justify-between">
              <div className="w-32 h-4 bg-gray-400"></div>
              <div className="flex gap-2">
                <div className="w-24 h-10 border-2 border-black"></div>
                <div className="w-10 h-10 border-2 border-black"></div>
                <div className="w-10 h-10 border-2 border-black"></div>
              </div>
            </div>

            {/* Auctions List */}
            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white border-2 border-black">
                  <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-1/3 h-48 md:h-auto bg-gray-300 border-b-2 md:border-b-0 md:border-r-2 border-black"></div>

                    {/* Content */}
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex gap-2 mb-3">
                            <div className="w-16 h-5 border border-black"></div>
                            <div className="w-16 h-5 border border-black"></div>
                          </div>
                          <div className="w-3/4 h-6 bg-black mb-2"></div>
                          <div className="w-1/2 h-4 bg-gray-400"></div>
                        </div>
                        <div className="text-right">
                          <div className="w-24 h-4 bg-gray-400 mb-2 ml-auto"></div>
                          <div className="w-32 h-8 bg-black"></div>
                        </div>
                      </div>

                      <div className="w-full h-4 bg-gray-300 mb-2"></div>
                      <div className="w-5/6 h-4 bg-gray-300 mb-4"></div>

                      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-300">
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-400"></div>
                            <div className="w-24 h-4 bg-gray-400"></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-400"></div>
                            <div className="w-20 h-4 bg-gray-400"></div>
                          </div>
                        </div>
                        <div className="w-24 h-10 border-2 border-black"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((page) => (
                <div
                  key={page}
                  className={`w-10 h-10 flex items-center justify-center border-2 border-black ${
                    page === 1 ? 'bg-black' : 'bg-white'
                  }`}
                >
                  <div className={`w-2 h-4 ${page === 1 ? 'bg-white' : 'bg-black'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
