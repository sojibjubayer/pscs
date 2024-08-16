import { useEffect, useState } from "react";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [priceRanges, setPriceRanges] = useState([
        { label: 'All', min: 0, max: Infinity },
        { label: '$0 - $50', min: 0, max: 50 },
        { label: '$50 - $100', min: 50, max: 100 },
        { label: '$100 - $200', min: 100, max: 200 },
        { label: '$200+', min: 200, max: Infinity }
    ]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState('All');
    const [selectedSort, setSelectedSort] = useState('PriceLowToHigh'); 
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/products?page=1&limit=1000`); 
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data && Array.isArray(data.products)) {
                setProducts(data.products);
                setFilteredProducts(data.products); // Initialize filtered products
                setBrands([...new Set(data.products.map(product => product["Brand Name"]))]); 
                setCategories([...new Set(data.products.map(product => product["Category"]))]); 
                setTotalPages(Math.ceil(data.products.length / 12)); 
            } else {
                throw new Error('Invalid data structure');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
       
        let filtered = products;

        if (searchTerm) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(product =>
                product["Product Name"].toLowerCase().includes(lowercasedSearchTerm)
            );
        }

        if (selectedBrand) {
            filtered = filtered.filter(product => product["Brand Name"] === selectedBrand);
        }

        if (selectedCategory) {
            filtered = filtered.filter(product => product["Category"] === selectedCategory);
        }

        if (selectedPriceRange !== 'All') {
            const range = priceRanges.find(range => range.label === selectedPriceRange);
            filtered = filtered.filter(product =>
                product["Price"] >= range.min && product["Price"] <= range.max
            );
        }

        // Sort filtered products based on selectedSort
        if (selectedSort === 'PriceLowToHigh') {
            filtered.sort((a, b) => a["Price"] - b["Price"]);
        } else if (selectedSort === 'PriceHighToLow') {
            filtered.sort((a, b) => b["Price"] - a["Price"]);
        } else if (selectedSort === 'DateNewest') {
            filtered.sort((a, b) => new Date(b["Product Creation Date and Time"]) - new Date(a["Product Creation Date and Time"]));
        }

        setFilteredProducts(filtered);
        setTotalPages(Math.ceil(filtered.length / 12)); 
        setPage(1); 
    }, [searchTerm, selectedBrand, selectedCategory, selectedPriceRange, selectedSort, products]);

    const currentPageProducts = filteredProducts.slice((page - 1) * 12, page * 12);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers.map(num => (
            <button
                key={num}
                onClick={() => setPage(num)}
                disabled={num === page}
                className={`mx-1 px-2 py-1 ${num === page ? 'bg-green-500 text-white' : 'bg-transparent border border-gray-300'} hover:bg-gray-200`}
            >
                {num}
            </button>
        ));
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by product name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded w-full"
                />
            </div>
          <div className="flex gap-16 justify-center">
          
            <div className="mb-4">
                <h3 className="font-bold mb-2">Filter by Brand</h3>
                <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                >
                    <option value="">All Brands</option>
                    {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <h3 className="font-bold mb-2">Filter by Category</h3>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <h3 className="font-bold mb-2">Filter by Price Range</h3>
                <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                >
                    {priceRanges.map(range => (
                        <option key={range.label} value={range.label}>{range.label}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <h3 className="font-bold mb-2">Sort by</h3>
                <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                >
                    <option value="PriceLowToHigh">Price: Low to High</option>
                    <option value="PriceHighToLow">Price: High to Low</option>
                    <option value="DateNewest">Date Added: Newest First</option>
                </select>
            </div>
          </div>
           
            {error && <p className="text-red-500">Error: {error}</p>}
            {loading ? (
                <p>Loading products...</p>
            ) : (
                <>
                    <div className="grid grid-cols-4 gap-4">
                        {currentPageProducts.length > 0 ? (
                            currentPageProducts.map((product, index) => (
                                <div key={index} className="border border-pink-300 p-4 rounded ">
                                    <h2 className="text-xl font-bold">{product["Product Name"]}</h2>
                                    <img src={product["Product Image"]} alt={product["Product Name"]} className="w-24 h-24 object-cover" />
                                    <p><strong>Description:</strong> {product["Description"]}</p>
                                    <p><strong>Price:</strong> ${product["Price"].toFixed(2)}</p>
                                    <p><strong>Category:</strong> {product["Category Name"]}</p>
                                    <p><strong>Brand:</strong> {product["Brand Name"]}</p>
                                    <p><strong>Ratings:</strong> {product["Ratings"]} stars</p>
                                    <p><strong>Creation Date and Time:</strong> {new Date(product["Product Creation Date and Time"]).toLocaleString()}</p>
                                </div>
                            ))
                        ) : (
                            <p>No products found</p>
                        )}
                    </div>
                    <div className="mt-4 flex items-center justify-center">
                        <button
                            onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-400"
                        >
                            Previous
                        </button>
                        {renderPageNumbers()}
                        <button
                            onClick={() => setPage(prevPage => Math.min(prevPage + 1, totalPages))}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-400"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Products;
