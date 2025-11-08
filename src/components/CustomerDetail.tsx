import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getCustomer,
  deleteCustomer,
  getCustomerServiceHistory,
  getCustomerNotes,
  addServiceHistory,
  addNote
} from '../firebase/customerService';
import type { Customer, ServiceHistory, Note } from '../types/customer';
import { useAuth } from '../contexts/AuthContext';
import './CustomerDetail.css';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistory[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'history' | 'notes'>('history');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  useEffect(() => {
    if (id) {
      loadCustomerData(id);
    }
  }, [id]);

  const loadCustomerData = async (customerId: string) => {
    try {
      const [customerData, history, customerNotes] = await Promise.all([
        getCustomer(customerId),
        getCustomerServiceHistory(customerId),
        getCustomerNotes(customerId)
      ]);
      setCustomer(customerData);
      setServiceHistory(history);
      setNotes(customerNotes);
    } catch (error) {
      console.error('Error loading customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        navigate('/customers');
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Error deleting customer');
      }
    }
  };

  const handleAddService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await addServiceHistory({
        customerId: id,
        date: new Date(formData.get('date') as string),
        serviceType: formData.get('serviceType') as string,
        description: formData.get('description') as string,
        technician: formData.get('technician') as string,
        cost: parseFloat(formData.get('cost') as string),
        parts: formData.get('parts') as string,
        status: formData.get('status') as 'completed' | 'pending' | 'scheduled'
      });
      setShowServiceForm(false);
      loadCustomerData(id);
      form.reset();
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const handleAddNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !user) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await addNote({
        customerId: id,
        content: formData.get('content') as string,
        author: user.email || 'Admin'
      });
      setShowNoteForm(false);
      loadCustomerData(id);
      form.reset();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!customer) {
    return <div className="error">Customer not found</div>;
  }

  return (
    <div className="customer-detail-container">
      <div className="detail-header">
        <div className="header-left">
          <button onClick={() => navigate('/customers')} className="back-button">
            ← Back
          </button>
          <div className="customer-avatar-large">
            {customer.firstName[0]}{customer.lastName[0]}
          </div>
          <div>
            <h1>{customer.firstName} {customer.lastName}</h1>
            <p className="customer-subtitle">{customer.email}</p>
          </div>
        </div>
        <div className="header-actions">
          <Link to={`/customers/${id}/edit`} className="btn btn-secondary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="info-card">
          <h2>Contact Information</h2>
          <div className="info-row">
            <span className="label">Phone:</span>
            <span>{customer.phone}</span>
          </div>
          <div className="info-row">
            <span className="label">Email:</span>
            <span>{customer.email}</span>
          </div>
          <div className="info-row">
            <span className="label">Address:</span>
            <span>
              {customer.address.street}<br />
              {customer.address.city}, {customer.address.state} {customer.address.zipCode}
            </span>
          </div>
        </div>

        <div className="info-card">
          <h2>Mower Information</h2>
          <div className="info-row">
            <span className="label">Brand:</span>
            <span>{customer.mowerDetails.brand}</span>
          </div>
          <div className="info-row">
            <span className="label">Model:</span>
            <span>{customer.mowerDetails.model}</span>
          </div>
          {customer.mowerDetails.serialNumber && (
            <div className="info-row">
              <span className="label">Serial #:</span>
              <span>{customer.mowerDetails.serialNumber}</span>
            </div>
          )}
          {customer.mowerDetails.purchaseYear && (
            <div className="info-row">
              <span className="label">Year:</span>
              <span>{customer.mowerDetails.purchaseYear}</span>
            </div>
          )}
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Service History ({serviceHistory.length})
          </button>
          <button
            className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes ({notes.length})
          </button>
        </div>

        {activeTab === 'history' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Service History</h2>
              <button
                onClick={() => setShowServiceForm(!showServiceForm)}
                className="btn btn-primary"
              >
                + Add Service
              </button>
            </div>

            {showServiceForm && (
              <form onSubmit={handleAddService} className="inline-form">
                <div className="form-row">
                  <input type="date" name="date" required />
                  <input type="text" name="serviceType" placeholder="Service Type *" required />
                  <input type="text" name="technician" placeholder="Technician *" required />
                </div>
                <div className="form-row">
                  <input type="number" name="cost" placeholder="Cost *" step="0.01" required />
                  <input type="text" name="parts" placeholder="Parts Used" />
                  <select name="status" required>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
                <textarea name="description" placeholder="Description *" required rows={3} />
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button type="button" onClick={() => setShowServiceForm(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="timeline">
              {serviceHistory.length === 0 ? (
                <p className="empty-state">No service history yet</p>
              ) : (
                serviceHistory.map(service => (
                  <div key={service.id} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <h3>{service.serviceType}</h3>
                        <span className={`status-badge ${service.status}`}>
                          {service.status}
                        </span>
                      </div>
                      <p className="timeline-date">
                        {new Date(service.date).toLocaleDateString()} • {service.technician}
                      </p>
                      <p className="timeline-description">{service.description}</p>
                      {service.parts && (
                        <p className="timeline-parts">Parts: {service.parts}</p>
                      )}
                      <p className="timeline-cost">${service.cost.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Notes</h2>
              <button
                onClick={() => setShowNoteForm(!showNoteForm)}
                className="btn btn-primary"
              >
                + Add Note
              </button>
            </div>

            {showNoteForm && (
              <form onSubmit={handleAddNote} className="inline-form">
                <textarea name="content" placeholder="Add a note..." required rows={4} />
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Save Note</button>
                  <button type="button" onClick={() => setShowNoteForm(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="notes-list">
              {notes.length === 0 ? (
                <p className="empty-state">No notes yet</p>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="note-card">
                    <div className="note-header">
                      <span className="note-author">{note.author}</span>
                      <span className="note-date">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="note-content">{note.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
