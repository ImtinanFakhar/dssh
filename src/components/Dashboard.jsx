import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Dashboard() {
  const [data, setData] = useState({
    sorted_products: [],
    total_amount_sum: 0,
    num_orders: 0,
    sales_by_vendor: {},
    sales_by_discount: {},
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const apiUrl = 'http://127.0.0.1:8000/dashboard/';
    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();

    axios.get(apiUrl, {
      params: {
        start_date: startISO,
        end_date: endISO,
      }
    })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [startDate, endDate]);

  return (
    <div className="p-4 bg-blue-100 min-h-screen">
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-4">Dashboard</h2>
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-4">
          <label className="mr-2 font-semibold text-lg">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="border border-gray-300 rounded p-2"
          />
          <label className="ml-4 mr-2 font-semibold text-lg">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="border border-gray-300 rounded p-2"
          />
        </div>

        <div className="flex flex-wrap -m-4">
          <div className="w-full md:w-1/2 lg:w-1/4 p-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h1 className="text-2xl font-semibold mb-4">Today's Sales</h1>
              <h2 className="mb-2 text-3xl font-bold text-blue-600">${data.total_amount_sum.toFixed(2) || 0}</h2>
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/4 p-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-2xl font-semibold mb-4">Number of Orders</h3>
              <p className="text-3xl font-bold text-blue-600">{data.num_orders || 0}</p>
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/4 p-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-2xl font-semibold mb-4">Sales by Vendor</h3>
              <table className="w-full">
                <tbody>
                  {Object.keys(data.sales_by_vendor).map((vendor, index) => (
                    <tr key={index}>
                      <td className="text-3xl font-bold text-blue-600">{vendor}</td>
                      <td className="text-3xl font-bold text-blue-600">${data.sales_by_vendor[vendor].toFixed(2) || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/4 p-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-2xl font-semibold mb-4">Top Selling Products</h3>
              {data.sorted_products.length > 0 ? (
                <table className="w-full">
                  <tbody>
                    {data.sorted_products.slice(0, 4).map(([product, info], index) => (
                      <tr key={index}>
                        <td className="text-3xl font-bold text-blue-600">{product}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-xl">No top selling products available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
