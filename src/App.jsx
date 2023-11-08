import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Products from './components/Products';
import Notes from './components/Notes';
function App() {
  return (
    <Router>
    <div>
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard/>}  /> 
        <Route path="/dashboard" element={<Dashboard/>}  /> 
        <Route path="/products" element={<Products/>} />
        <Route path="/orders" element={<Orders/>} />
        <Route path="Notes" element={<Notes/>} />
         </Routes>
    </div>
  </Router>
    )
}

export default App;
