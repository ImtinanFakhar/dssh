import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import '../App.css';
function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const productsPerPage = 30;
 
  // Function to handle sorting
  const sortProducts = (productsToSort, sortKey) => {
    return productsToSort.sort((a, b) => {
      switch (sortKey) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        // Add additional cases for other sort options here
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    setIsLoading(true);
    axios.get('http://127.0.0.1:8000/all-products/')
      .then((response) => {
        const jsonData = JSON.parse(response.data);
        setProducts(jsonData);
        setFilteredProducts(sortProducts(jsonData, 'date-desc'));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let results = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    results = sortProducts(results, sortKey);
    setFilteredProducts(results);
    setCurrentPage(0);
  }, [searchTerm, products, sortKey]);

  const offset = currentPage * productsPerPage;
  const currentProducts = filteredProducts.slice(offset, offset + productsPerPage);
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Product Catalog</h1>
  
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search Products"
          className="p-2 border rounded mr-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {/* Sort By Dropdown */}
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Sort By</option>
          <option value="title-asc">Alphabetically, A-Z</option>
          <option value="title-desc">Alphabetically, Z-A</option>
          <option value="price-asc">Price, low to high</option>
          <option value="price-desc">Price, high to low</option>
          <option value="date-asc">Date, old to new</option>
          <option value="date-desc">Date, new to old</option>
        </select>
      </div>
  
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-t-red-500 border-b-4 border-b-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
              <div key={product.id} className="border bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 relative">
                <div className="glass-effect absolute inset-0 rounded-lg bg-opacity-30"></div>
                <img
                  src={product.images.length > 0 ? product.images[0].src : 'placeholder-image.jpg'}
                  alt={product.title}
                  className="w-48 h-48 mx-auto mb-4 object-cover object-center"
                />
                <h2 className="text-lg font-semibold text-gray-700 mb-3">{product.title}</h2>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-red-500 font-bold text-xl">${product.price}</span>
                  <span className="text-sm text-gray-600">Qty Left: {product.quantity}</span>
                </div>
                {/* Additional action buttons or information can be added here */}
              </div>
            ))}
          </div>
          <div className="pagination-container flex justify-center mt-10">
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'flex list-none pl-0 rounded my-2'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-gray-700 hover:bg-gray-200 rounded'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-gray-700 hover:bg-gray-200 rounded'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-gray-700 hover:bg-gray-200 rounded'}
              breakClassName={'page-item'}
              breakLinkClassName={'page-link relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-gray-700 rounded'}
              activeClassName={'active bg-blue-500 text-white hover:bg-blue-600'}
              activeLinkClassName={'relative block py-2 px-3 leading-tight'}
            />
          </div>
        </>
      )}
    </div>
  )};

export default Products;
