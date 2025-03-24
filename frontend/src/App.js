import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Dashboard from './components/Dashboard';
import ProductManager from './components/ProductManager';
import Billing from './components/Billing';
import Report from './components/Report';

const App = () => {
    return (
        <Router>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<ProductManager />} />
                        <Route path="/billing" element={<Billing />} />
                        <Route path="/reports" element={<Report />} />
                        {/* Add route for reports if needed */}
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
