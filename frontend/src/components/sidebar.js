import React from 'react';
import { NavLink } from 'react-router-dom';
import '../sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Business Manager</h2>
            <NavLink to="/" exact="true" activeClassName="active">Dashboard</NavLink>
            <NavLink to="/products" activeClassName="active">Products</NavLink>
            <NavLink to="/billing" activeClassName="active">Invoices</NavLink>
            <NavLink to="/reports" activeClassName="active">Reports</NavLink>    
        </div>
    );
};

export default Sidebar;
