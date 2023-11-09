import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Dashboard() {
  const [data, setData] = useState({
    sorted_products: [],
    total_amount_sum: 0,
    total_after_commission: 0,
    num_orders: 0,
    sales_by_vendor: {},
    sales_by_discount: {},
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const apiUrl = "http://127.0.0.1:8000/dashboard/";
    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();

    axios
      .get(apiUrl, {
        params: {
          start_date: startISO,
          end_date: endISO,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [startDate, endDate]);

  // Ensures the number is displayed in the fixed-point notation
  function calculateAndFormatTotalAfterCommission(totalSales) {
    const percentageCommission = 14.9 / 100;
    const fixedCommission = 0.3;
    const totalAfterCommission =
      totalSales - (totalSales * percentageCommission - fixedCommission);
    return formatCurrency(totalAfterCommission);
  }
  console.log(data.sales_by_discount);

  function formatCurrency(value) {
    // Format the value as currency
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-10">Dashboard</h2>

        {/* Date Picker and Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Date Picker Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden ring-1 ring-gray-200 hover:ring-blue-500 transition-all">
            <div className="px-5 py-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Date Range
              </h3>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="form-input w-full mb-4 p-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="form-input w-full p-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md"
              />
            </div>
          </div>

          {/* Total Sales After Commission Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden ring-1 ring-gray-200 hover:ring-blue-500 transition-all">
            <div className="px-5 py-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Total Sales
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(data.total_after_commission)}
              </p>
            </div>
          </div>

          {/* Total Sales Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden ring-1 ring-gray-200 hover:ring-blue-500 transition-all">
            <div className="px-5 py-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Total Sales After Commission
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(data.total_amount_sum)}
              </p>
            </div>
          </div>

          {/* Number of Orders Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden ring-1 ring-gray-200 hover:ring-blue-500 transition-all">
            <div className="px-5 py-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Number of Orders
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {data.num_orders}
              </p>
            </div>
          </div>
        </div>
        {/* Sales by Discount Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden ring-1 ring-gray-200 hover:ring-blue-500 transition-all mb-12">
          {" "}
          {/* Adjusted mb-8 to mb-12 */}
          <div className="px-5 py-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Sales by Discount
            </h3>
            <ul className="list-disc list-inside">
              {Object.entries(data.sales_by_discount).map(
                ([discount, sales], index) => (
                  <li key={index} className="mb-2 text-lg text-gray-800">
                    {discount}%: {formatCurrency(sales)}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Sales by Vendor Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 ring-1 ring-gray-200 hover:ring-blue-500 transition-all">
          <div className="px-5 py-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Sales by Vendor
            </h3>
            <ul className="list-disc list-inside">
              {Object.entries(data.sales_by_vendor).map(
                ([vendor, sales], index) => (
                  <li key={index} className="mb-2 text-lg text-gray-800">
                    {vendor}: {formatCurrency(sales)}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Top Selling Products Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Top Selling Products
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.sorted_products.length > 0 ? (
              data.sorted_products.map((product, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 p-5 ring-1 ring-gray-200 hover:ring-blue-500 transition-all"
                >
                  <h4 className="text-lg font-bold text-gray-800 truncate">
                    {product[0]}
                  </h4>{" "}
                  {/* Product Name */}
                  <p className="text-blue-600 font-semibold my-2">
                    {formatCurrency(product[1].sales)}
                  </p>{" "}
                  {/* Sales */}
                  <p className="text-sm text-gray-600">
                    Price: {formatCurrency(product[1].price)}
                  </p>{" "}
                  {/* Price */}
                  <p className="text-sm text-gray-600">
                    Units Sold: {product[1].units_sold}
                  </p>{" "}
                  {/* Units Sold */}
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">No products found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
