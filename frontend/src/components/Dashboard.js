import React, { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../services/api';
import "../dashboard.css";

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalInvoices: 0,
        totalRevenue: 0,
        lowStockItems: 0
    });

    useEffect(() => {
        const getStats = async () => {
            const data = await fetchDashboardStats();
            console.log("📊 Stats from backend:", data); 
            setStats(data);
        };
        getStats();
    }, []);

    return (
        <div className="dashboard-container">
    <h1 className="dashboard-title">Dashboard</h1>
    <div className="dashboard-cards">
        <div className="dashboard-card">
            <h3>Total Products</h3>
            <p>{stats.totalProducts}</p>
            <small>Items in inventory</small>
        </div>
        <div className="dashboard-card">
            <h3>Total Invoices</h3>
            <p>{stats.totalInvoices}</p>
            <small>Generated invoices</small>
        </div>
        <div className="dashboard-card">
            <h3>Total Revenue</h3>
            <p>₹{stats.totalRevenue}</p>
            <small>Lifetime earnings</small>
        </div>
        <div className="dashboard-card">
            <h3>Low Stock Items</h3>
            <p>{stats.lowStockItems}</p>
            <small>Items need restock</small>
        </div>
    </div>
</div>
    );
};

export default Dashboard;
