import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    <div className="p-4">
      <div className="mb-4">
        <label className="text-lg font-semibold text-gray-600 mr-2">
          Start Date:
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="border rounded px-3 py-2 text-gray-800"
        />
      </div>
      <div className="mb-4">
        <label className="text-lg font-semibold text-gray-600 mr-2">
          End Date:
        </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          className="border rounded px-3 py-2 text-gray-800"
        />
      </div>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        onClick={fetchOrders}
      >
        Fetch Data
      </button>
      {loading ? (
        <p className="text-lg font-semibold mt-8">Loading data...</p>
      ) : data ? (
        <div>
          <div className="flex justify-center align-middle">
            <div className="mb-4 p-4 bg-white shadow-md rounded">
              <h2 className="text-3xl font-bold text-gray-800">
                Order Summary
              </h2>
              <div className="flex justify-between mt-4">
                <div className="p-4 border rounded bg-gray-100">
                  <p className="text-3xl font-bold text-blue-500">
                    ${data.total_amount_sum.toFixed(2)}
                  </p>
                  <p className="text-gray-600">Total Amount Sum</p>
                </div>
                <div className="p-4 border rounded bg-gray-100">
                  <p className="text-3xl font-bold text-blue-500">
                    {data.num_orders}
                  </p>
                  <p className="text-gray-600">Number of Orders</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ordered Products
            </h2>
            {data.orders.map((order, index) => (
              <div key={index} className="py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-xl font-semibold text-gray-800">
                    Order #{index + 1}
                  </div>
                  <div className="text-gray-600">
                    Date: {order.created_at.split("T")[0]}
                  </div>
                </div>
                <div className="text-xl font-semibold text-blue-500 mt-2">
                  Total Price: ${parseFloat(order.total_price).toFixed(2)}
                </div>
                <div className="mt-4">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded hover-bg-blue-600"
                    onClick={() => toggleProductDetails(index)}
                  >
                    {showProductDetails[index]
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </div>
                {/* Display ordered products only if showProductDetails is true for this order */}
                {showProductDetails[index] && (
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Ordered Products
                    </h3>
                    <ul className="list-disc pl-8 text-lg">
                      {order.line_items.map((item, i) => (
                        <li key={i} className="text-gray-800">
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
        <p className="text-lg font-semibold mt-8 text-gray-800">
          No data available.
        </p>
      )}
    </div>
  );
}

export default App;
