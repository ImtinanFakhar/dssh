import React from "react";
import { Link } from "react-router-dom";

import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Products from "./Products";

function Navigation() {
  return (
    <div>
      <nav className="bg-black p-4 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="public/logo.png"
            alt="HRoom Logo"
            className="w-8 h-8 mr-2"
          />
          <div className="text-white text-2xl font-bold">Room</div>
        </div>
        <ul className="flex space-x-4">
          <li className="text-white hover:text-blue-600">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="text-white hover:text-blue-600">
            <Link to="/orders">Orders</Link>
          </li>
          <li className="text-white hover:text-blue-600">
            <Link to="/products">Products</Link>
          </li>
          <li className="text-white hover:text-blue-600">
            <Link to="/Notes">Notes</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navigation;
