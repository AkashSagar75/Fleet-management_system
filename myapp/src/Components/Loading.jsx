const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto" />

        <p className="mt-3 text-gray-600">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;