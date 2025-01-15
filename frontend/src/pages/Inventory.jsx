import React, { useEffect, useState } from "react";
import axios from "axios";

const Inventory = () => {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    price: "",
    mileage: "",
    color: "",
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("https://buycars-6lbf.onrender.com/api/inventory", { params: filters });
        setCars(response.data);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      }
    };
    fetchCars();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Car Inventory</h2>

      {/* Filter form */}
      <div className="flex justify-center space-x-6 mb-6">
        <div className="flex items-center space-x-2">
          <input
            type="number"
            name="price"
            placeholder="Max Price"
            value={filters.price}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            name="mileage"
            placeholder="Max Mileage"
            value={filters.mileage}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            name="color"
            placeholder="Color"
            value={filters.color}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car) => (
          <div key={car._id} className="bg-white p-4 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
            <img src={car.image_url} alt={car.title} className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">{car.title}</h3>
            <div className="flex justify-between mt-2 text-gray-600">
              <p className="text-lg">Price: ${car.price}</p>
              <p className="text-lg">Mileage: {car.mileage} miles</p>
            </div>
            <p className="text-sm mt-2 text-gray-500">Color: {car.color}</p>
            <button className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
