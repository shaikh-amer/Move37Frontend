import React from "react";

const FavoritesPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-6xl font-bold text-gray-200">Favorites</h1>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Saved Items</h2>
        <p className="text-gray-600 mb-6">
          Quick access to your favorite and frequently used items.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-4 flex items-center"
            >
              <div className="w-12 h-12 bg-gray-100 rounded mr-4" />
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-16 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
