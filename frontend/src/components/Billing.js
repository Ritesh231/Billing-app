import React, { useState } from "react";
import { generateBill } from "../services/api";
import "./Billing.css";

const Billing = () => {
    const [customerName, setCustomerName] = useState("");
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: "", price: "", quantity: "" });

    const handleAddItem = () => {
        if (!newItem.name || !newItem.price || !newItem.quantity) return;
        setItems([...items, newItem]);
        setNewItem({ name: "", price: "", quantity: "" });
    };

    const handleGenerateBill = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/bills/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customerName, items }),
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = "bill.pdf";
            document.body.appendChild(link);
            link.click();
            link.remove();

            setItems([]);
            setCustomerName("");
        } catch (error) {
            console.error("Error generating bill:", error);
        }
    };


    const getTotal = () => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    return (
        <div>
            <h2>Billing</h2>
       
            <div className="product-form">
            <input placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
            <input placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            <input placeholder="Price" type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: parseFloat(e.target.value) })} />
            <input placeholder="Quantity" type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })} />
            <button className="btn1" onClick={handleAddItem}>Add Item</button>
            <button className="btn2" onClick={handleGenerateBill}>Generate Bill</button>
            </div>

            <h3>Bill Items:</h3>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>{item.name} - {item.quantity} x ₹{item.price}</li>
                ))}
            </ul>
            <h4>Total: ₹{getTotal()}</h4>
           
        </div>
    );
};

export default Billing;
