'use client';

import { useEffect, useState } from 'react';
import { recordAPI } from '@/lib/api';
import Header from '@/components/layout/Header';
import { FinancialRecord } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function RecordsPage() {
  const { isEditor, isAdmin } = useAuth();
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState<FinancialRecord | null>(null);
  const [filters, setFilters] = useState({ type: '', category: '', startDate: '', endDate: '' });
  const [form, setForm] = useState({
    amount: '',
    type: 'INCOME',
    category: '',
    date: '',
    notes: '',
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await recordAPI.getAll(filters);
      setRecords(res.data.records);
    } catch (error) {
      console.error('Failed to fetch records', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editRecord) {
        await recordAPI.update(editRecord.id, {
          ...form,
          amount: parseFloat(form.amount),
        });
      } else {
        await recordAPI.create({
          ...form,
          amount: parseFloat(form.amount),
        });
      }
      setShowForm(false);
      setEditRecord(null);
      setForm({ amount: '', type: 'INCOME', category: '', date: '', notes: '' });
      fetchRecords();
    } catch (error) {
      console.error('Failed to save record', error);
    }
  };

  const handleEdit = (record: FinancialRecord) => {
    setEditRecord(record);
    setForm({
      amount: record.amount.toString(),
      type: record.type,
      category: record.category,
      date: record.date.slice(0, 10),
      notes: record.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await recordAPI.delete(id);
      fetchRecords();
    } catch (error) {
      console.error('Failed to delete record', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#2d2d5e',
    border: '1px solid #3d3d7e',
    borderRadius: '0.5rem',
    color: '#e2e8f0',
    fontSize: '0.875rem',
    outline: 'none',
  };

  return (
    <div>
      <Header title="Financial Records" />
      <div style={{ padding: '1.5rem' }}>

        {/* Top Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{ color: '#e2e8f0', fontWeight: 600 }}>All Records</h2>
          {(isEditor() || isAdmin()) && (
            <button
              onClick={() => { setShowForm(true); setEditRecord(null); }}
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              + Add Record
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: '#1a1a2e',
          border: '1px solid #2d2d5e',
          borderRadius: '0.75rem',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            style={inputStyle}
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <input
            type="text"
            placeholder="Filter by category"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            style={inputStyle}
          />
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            style={inputStyle}
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            style={inputStyle}
          />
          <button
            onClick={fetchRecords}
            style={{
              padding: '0.75rem',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Apply Filters
          </button>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#00000080',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}>
            <div style={{
              backgroundColor: '#1a1a2e',
              border: '1px solid #2d2d5e',
              borderRadius: '1rem',
              padding: '2rem',
              width: '100%',
              maxWidth: '480px',
            }}>
              <h3 style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: '1.5rem' }}>
                {editRecord ? 'Edit Record' : 'Add New Record'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ color: '#a0aec0', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Amount</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                    placeholder="0.00"
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ color: '#a0aec0', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ color: '#a0aec0', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                    placeholder="e.g. Salary, Food, Rent"
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ color: '#a0aec0', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ color: '#a0aec0', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Notes (optional)</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Any additional notes..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: '#7c3aed',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {editRecord ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditRecord(null); }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: 'transparent',
                      color: '#a0aec0',
                      border: '1px solid #2d2d5e',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Records Table */}
        <div style={{
          backgroundColor: '#1a1a2e',
          border: '1px solid #2d2d5e',
          borderRadius: '0.75rem',
          overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
              Loading records...
            </div>
          ) : records.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
              No records found
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Category', 'Type', 'Amount', 'Date', 'Notes', 'Actions'].map((h) => (
                    <th key={h} style={{
                      textAlign: 'left',
                      padding: '1rem',
                      color: '#718096',
                      fontSize: '0.75rem',
                      borderBottom: '1px solid #2d2d5e',
                      backgroundColor: '#16162a',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} style={{ borderBottom: '1px solid #2d2d5e' }}>
                    <td style={{ padding: '1rem', color: '#e2e8f0', fontSize: '0.875rem' }}>
                      {record.category}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: record.type === 'INCOME' ? '#10b98120' : '#ef444420',
                        color: record.type === 'INCOME' ? '#10b981' : '#ef4444',
                      }}>
                        {record.type}
                      </span>
                    </td>
                    <td style={{
                      padding: '1rem',
                      color: record.type === 'INCOME' ? '#10b981' : '#ef4444',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}>
                      {formatCurrency(record.amount)}
                    </td>
                    <td style={{ padding: '1rem', color: '#718096', fontSize: '0.875rem' }}>
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', color: '#718096', fontSize: '0.875rem' }}>
                      {record.notes || '—'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {(isEditor() || isAdmin()) && (
                          <button
                            onClick={() => handleEdit(record)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              backgroundColor: '#3b82f620',
                              color: '#3b82f6',
                              border: '1px solid #3b82f6',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                            }}
                          >
                            Edit
                          </button>
                        )}
                        {isAdmin() && (
                          <button
                            onClick={() => handleDelete(record.id)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              backgroundColor: '#ef444420',
                              color: '#ef4444',
                              border: '1px solid #ef4444',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}