import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchProducts, addProduct } from "../services/api";
import "./productmodel.css";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    sku: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const loadProducts = async () => {
    const res = await fetchProducts();
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddOrUpdateProduct = async () => {
    const productData = {
      name: newProduct.name.trim(),
      description: newProduct.description?.trim(),
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      sku: newProduct.sku?.trim(),
    };

    if (!productData.name || isNaN(productData.price) || isNaN(productData.stock)) {
      alert("Please fill out all fields with valid data.");
      return;
    }

    if (isEditing) {
      console.log("🔧 Editing product ID:", editingId);
      console.log("🔧 Sending data:", productData);
      const res = await axios.put(`https://lbilling-app-1.onrender.com/api/products/${editingId}`, productData);
      console.log("✅ Response from backend:", res.data);
      alert("✅ Product updated!");
    }
    

      setNewProduct({ name: "", description: "", price: "", stock: "", sku: "" });
      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
      loadProducts();
    
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`https://billing-app-1.onrender.com/api/products/${productId}`);
      alert("🗑️ Product deleted!");
      loadProducts();
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Failed to delete product.");
    }
  };

  const handleEdit = (product) => {
    setShowForm(true);
    setIsEditing(true);
    setEditingId(product._id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      sku: product.sku,
    });
  };

  return (
    <div className="product-manager-container">
      <h2>Products</h2>
      <button
        className="add-product-btn"
        onClick={() => {
          setShowForm(true);
          setIsEditing(false);
          setNewProduct({ name: "", description: "", price: "", stock: "", sku: "" });
        }}
      >
        + Add Product
      </button>

      {showForm && (
        <div className="add-product-form">
          <h2>{isEditing ? "Edit Product" : "Add New Product"}</h2>
          <input
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <textarea
            placeholder="Description (e.g. Customer Name)"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <input
            placeholder="Price"
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <input
            placeholder="Quantity"
            type="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          />
          <input
            placeholder="SKU"
            value={newProduct.sku}
            onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
          />
          <div className="form-buttons">
            <button onClick={handleAddOrUpdateProduct}>
              {isEditing ? "Update Product" : "Save Product"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setIsEditing(false);
                setEditingId(null);
                setNewProduct({ name: "", description: "", price: "", stock: "", sku: "" });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>
                <strong>{product.name}</strong>
                <div className="desc">{product.description}</div>
              </td>
              <td>{product.sku || "-"}</td>
              <td>₹{parseFloat(product.price).toFixed(2)}</td>
              <td>{product.stock}</td>
              <td className="actions">
                <button className="edit-btn" onClick={() => handleEdit(product)}>✏️</button>
                <button className="delete-btn" onClick={() => handleDelete(product._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManager;
