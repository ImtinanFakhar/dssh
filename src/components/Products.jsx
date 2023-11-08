import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

function Products() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 20; // Number of products to display per page

  useEffect(() => {
    // Fetch product data from the API endpoint when the component mounts
    axios.get('http://127.0.0.1:8000/all-products/')
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
      <h1 className="text-3xl font-bold mb-4">Product</h1>
      <div className="grid grid-cols-3 gap-4">
        {currentProducts.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow relative">
            <div className="glass-effect"></div>
            <img
              src={product.images.length > 0 ? product.images[0].src : 'placeholder-image.jpg'}
              alt={product.title}
              className="w-48 h-48 mx-auto mb-2 z-10"
            />
            <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-red-500 font-bold text-xl">${product.price}</span>
              <span className="text-gray-600">Quantity Left: {product.quantity}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination-container">
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          pageLinkClassName={'page-link'}
          previousLinkClassName={'prev-link'}
          nextLinkClassName={'next-link'}
          activeClassName={'active'}
        />
      </div>
    </div>
  );
}

export default Products;
