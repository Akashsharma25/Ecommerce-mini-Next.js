import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        const uniqueCategories = [
          "all",
          ...new Set(data.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" || product.category === selectedCategory)
  );

  const handleSearchSelect = (title) => {
    setSearchTerm(title);
    setShowSuggestions(false); // Hide suggestions after selection
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold text-white">E-Commerce</h1>
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 pl-10 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-700 text-gray-100"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true); // Show suggestions while typing
            }}
          />
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          {searchTerm && showSuggestions && (
            <div className="absolute top-12 left-0 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10">
              {filteredProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="p-2 hover:bg-gray-600 cursor-pointer"
                  onClick={() => handleSearchSelect(product.title)}
                >
                  {product.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4 flex-grow">
        <div className="mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border border-gray-700 p-4 rounded-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer bg-gray-800"
              onClick={() => setSelectedProduct(product)}
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-64 object-cover mb-4 rounded-lg"
              />
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-400 mb-2">${product.price}</p>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full relative shadow-xl animate-fadeIn text-gray-100">
              <div className="absolute top-2 right-2">
                <button
                  className="bg-gray-700 text-white pb-1.5 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-600 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-lg text-3xl"
                  onClick={() => setSelectedProduct(null)}
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
              <div className="mb-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-64 object-cover rounded-lg"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                {selectedProduct.title}
              </h2>
              <p className="text-gray-400 mb-4">${selectedProduct.price}</p>
              <p>{selectedProduct.description}</p>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-gray-100 p-6 text-center mt-auto">
        <div className="container mx-auto">
          <p className="mb-2">&copy; 2024 E-Commerce. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-gray-400 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-400 transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-400 transition">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
