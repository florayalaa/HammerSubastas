export function LoginWireframe() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="w-32 h-8 bg-black"></div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-48 h-10 bg-black mx-auto mb-4"></div>
            <div className="w-64 h-4 bg-gray-400 mx-auto"></div>
          </div>

          {/* Form Container */}
          <div className="bg-white border-2 border-black p-8">
            {/* Email Field */}
            <div className="mb-6">
              <div className="w-32 h-5 bg-black mb-2"></div>
              <div className="border-2 border-black p-3 flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-400"></div>
                <div className="w-full h-4 bg-gray-200"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <div className="w-32 h-5 bg-black mb-2"></div>
              <div className="border-2 border-black p-3 flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-400"></div>
                <div className="w-full h-4 bg-gray-200"></div>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black"></div>
                <div className="w-24 h-4 bg-gray-400"></div>
              </div>
              <div className="w-32 h-4 bg-gray-400"></div>
            </div>

            {/* Submit Button */}
            <div className="w-full h-12 bg-black mb-6"></div>

            {/* Divider */}
            <div className="border-t-2 border-gray-300 my-6"></div>

            {/* Sign Up Link */}
            <div className="text-center">
              <div className="w-48 h-4 bg-gray-400 mx-auto mb-2"></div>
              <div className="w-32 h-4 bg-black mx-auto"></div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="flex justify-center gap-4">
              <div className="w-24 h-4 bg-gray-400"></div>
              <div className="w-24 h-4 bg-gray-400"></div>
              <div className="w-24 h-4 bg-gray-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
