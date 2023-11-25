import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  // Set the initial startDate to the present day
  const initialStartDate = new Date();
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState([]);

  const fetchOrders = () => {
    setLoading(true);

    axios
      .get("https://hyperoomco.pythonanywhere.com/orders/", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      })
      .then((response) => {
        setData(response.data);
        // Initialize showProductDetails state with all orders set to false (hidden)
        setShowProductDetails(
          new Array(response.data.orders.length).fill(false)
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [startDate, endDate]);

  const toggleProductDetails = (index) => {
    // Create a copy of showProductDetails and toggle the value for the specified order index
    const updatedShowProductDetails = [...showProductDetails];
    updatedShowProductDetails[index] = !updatedShowProductDetails[index];
    setShowProductDetails(updatedShowProductDetails);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end mb-6">
          <div className="md:w-1/3 mb-4 md:mb-0 md:pr-4">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Start Date:
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border rounded px-3 py-2 w-full text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            />
          </div>
          <div className="md:w-1/3 mb-4 md:mb-0 md:px-2">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              End Date:
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="border rounded px-3 py-2 w-full text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            />
          </div>
          <div className="md:w-1/3 md:pl-4 flex justify-center md:justify-end">
            <button
              className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
              onClick={fetchOrders}
            >
              Fetch Data
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-600">
              Loading data...
            </p>
          </div>
        ) : data ? (
          <div>
            {/* Order Summary Section */}
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">
                Order Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow duration-200 ease-in-out">
                  <p className="text-3xl font-bold text-blue-500">
                    ${data.total_amount_sum.toFixed(2)}
                  </p>
                  <p className="text-gray-600">
                    Total Amount Sum After Commission
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden ring-1 ring-gray-200 hover:ring-blue-500 transition-all">
                  <div className="px-5 py-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">
                      Number of Orders
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                      <FontAwesomeIcon icon={faShoppingCart} />{" "}
                      {data.num_orders}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ordered Products Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Ordered Products
              </h2>
              {data.orders.map((order, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg p-4 mb-6"
                >
                  <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Order #{index + 1}
                    </h3>
                    <p className="text-sm font-semibold text-gray-600">
                      Date: {order.created_at.split("T")[0]}
                    </p>
                  </div>
                  <div className="text-xl font-semibold text-blue-500 mb-4">
                    Total Price: ${parseFloat(order.total_price).toFixed(2)}
                  </div>
                  <div>
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300 ease-in-out"
                      onClick={() => toggleProductDetails(index)}
                    >
                      {showProductDetails[index]
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                  </div>
                  {showProductDetails[index] && (
                    <div className="mt-4">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">
                        Products
                      </h4>
                      <ul className="list-disc pl-5 text-gray-800">
                        {order.line_items.map((item, i) => (
                          <li key={i} className="mb-1">
                            {item.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800">
              No data available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
