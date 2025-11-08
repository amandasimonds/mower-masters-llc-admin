import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCustomers } from '../firebase/customerService';
import type { Customer } from '../types/customer';
import './CustomerList.css';

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.firstName.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.includes(searchTerm)
    );
  });

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <div className="customer-list-container">
      <div className="list-header">
        <h1>Customers</h1>
        <Link to="/customers/new" className="btn btn-primary">
          + Add Customer
        </Link>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search customers by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="customers-grid">
        {filteredCustomers.length === 0 ? (
          <div className="no-customers">
            <p>No customers found. Add your first customer to get started!</p>
          </div>
        ) : (
          filteredCustomers.map(customer => (
            <Link
              key={customer.id}
              to={`/customers/${customer.id}`}
              className="customer-card"
            >
              <div className="customer-avatar">
                {customer.firstName[0]}{customer.lastName[0]}
              </div>
              <div className="customer-info">
                <h3>{customer.firstName} {customer.lastName}</h3>
                <p className="customer-email">{customer.email}</p>
                <p className="customer-phone">{customer.phone}</p>
                <div className="customer-mower">
                  <span className="mower-icon">🚜</span>
                  {customer.mowerDetails.brand} {customer.mowerDetails.model}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
