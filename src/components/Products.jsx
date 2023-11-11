import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

function Products() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 30; // Number of products to display per page

  useEffect(() => {
    // Fetch product data from the API endpoint when the component mounts
    axios.get('https://hyperoomco.pythonanywhere.com/all-products/')
      .then((response) => {
        // Parse the response data as JSON, if needed
        const jsonData = JSON.parse(response.data);
        setProducts(jsonData);
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
      });
  }, []);

  const offset = currentPage * productsPerPage;
  const currentProducts = products.slice(offset, offset + productsPerPage);

  const pageCount = Math.ceil(products.length / productsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Product Catalog</h1>
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
    </div>
  );
}

export default Products;
