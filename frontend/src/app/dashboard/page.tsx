'use client';

import { useEffect, useState } from 'react';
import { dashboardAPI } from '@/lib/api';
import Header from '@/components/layout/Header';
import { DashboardSummary } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from 'recharts';

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [weekly, setWeekly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, monthlyRes, categoryRes, recentRes, weeklyRes] = await Promise.all([
          dashboardAPI.getSummary(),
          dashboardAPI.getMonthly(),
          dashboardAPI.getCategories(),
          dashboardAPI.getRecent(),
          dashboardAPI.getWeekly(),
        ]);

        setSummary(summaryRes.data);

        const monthlyArray = Object.entries(monthlyRes.data).map(([month, values]: any) => ({
          month,
          income: values.income,
          expense: values.expense,
          net: values.income - values.expense,
        }));
        setMonthly(monthlyArray);

        const categoryArray = Object.entries(categoryRes.data).map(([name, values]: any) => ({
          name,
          income: values.income,
          expense: values.expense,
          total: values.income + values.expense,
        }));
        setCategories(categoryArray);

        setRecent(recentRes.data);

        const weeklyArray = Object.entries(weeklyRes.data).map(([day, values]: any) => ({
          day: day.slice(5),
          income: values.income,
          expense: values.expense,
        }));
        setWeekly(weeklyArray);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const cardStyle = {
    backgroundColor: '#1a1a24',
    border: '1px solid #2a2a3a',
    borderRadius: '0.75rem',
    padding: '1.25rem',
  };

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: '#1a1a24',
      border: '1px solid #2a2a3a',
      borderRadius: '0.5rem',
      color: '#e2e8f0',
    },
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#0d0d14',
        color: '#7c3aed',
        fontSize: '1.25rem',
      }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0d0d14', minHeight: '100vh' }}>
      <Header title="Dashboard" />
      <div style={{ padding: '1.5rem' }}>

        {/* Welcome Banner */}
        <div style={{
          ...cardStyle,
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)',
          border: '1px solid #7c3aed40',
        }}>
          <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700 }}>
            Welcome back, {user?.name}! 👋
          </h2>
          <p style={{ color: '#9ca3af', marginTop: '0.25rem', fontSize: '0.875rem' }}>
            You are logged in as <span style={{ color: '#7c3aed', fontWeight: 600 }}>{user?.role}</span>.
            {user?.role === 'VIEWER' && ' You have read-only access to the dashboard.'}
            {user?.role === 'ANALYST' && ' You can view records and access insights and analytics.'}
            {user?.role === 'EDITOR' && ' You can create and update financial records.'}
            {user?.role === 'ADMIN' && ' You have full access to manage everything.'}
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Total Income</p>
              <span style={{
                width: '36px', height: '36px', backgroundColor: '#10b98120',
                borderRadius: '8px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1rem',
              }}>💚</span>
            </div>
            <p style={{ color: '#10b981', fontSize: '1.75rem', fontWeight: 700, marginTop: '0.5rem' }}>
              {formatCurrency(summary?.totalIncome || 0)}
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>All time income</p>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Total Expenses</p>
              <span style={{
                width: '36px', height: '36px', backgroundColor: '#ef444420',
                borderRadius: '8px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1rem',
              }}>🔴</span>
            </div>
            <p style={{ color: '#ef4444', fontSize: '1.75rem', fontWeight: 700, marginTop: '0.5rem' }}>
              {formatCurrency(summary?.totalExpenses || 0)}
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>All time expenses</p>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Net Balance</p>
              <span style={{
                width: '36px', height: '36px', backgroundColor: '#7c3aed20',
                borderRadius: '8px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1rem',
              }}>💰</span>
            </div>
            <p style={{
              color: (summary?.netBalance || 0) >= 0 ? '#10b981' : '#ef4444',
              fontSize: '1.75rem', fontWeight: 700, marginTop: '0.5rem',
            }}>
              {formatCurrency(summary?.netBalance || 0)}
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>Income - Expenses</p>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Total Records</p>
              <span style={{
                width: '36px', height: '36px', backgroundColor: '#3b82f620',
                borderRadius: '8px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1rem',
              }}>📋</span>
            </div>
            <p style={{ color: '#3b82f6', fontSize: '1.75rem', fontWeight: 700, marginTop: '0.5rem' }}>
              {summary?.totalRecords || 0}
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>Financial entries</p>
          </div>
        </div>

        {/* VIEWER - Only sees summary */}
        {user?.role === 'VIEWER' && (
          <div style={{ ...cardStyle, textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '3rem' }}>👁️</p>
            <p style={{ color: '#ffffff', fontWeight: 600, fontSize: '1.125rem', marginTop: '1rem' }}>
              View Only Access
            </p>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
              You can see the summary above. Contact your admin for more access.
            </p>
          </div>
        )}

        {/* ANALYST, EDITOR, ADMIN - See charts */}
        {user?.role !== 'VIEWER' && (
          <>
            {/* Charts Row 1 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1rem',
            }}>
              {/* Monthly Trends */}
              <div style={cardStyle}>
                <h3 style={{ color: '#ffffff', fontWeight: 600, marginBottom: '1rem' }}>
                  📈 Monthly Income vs Expenses
                </h3>
                {monthly.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={monthly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                      <YAxis stroke="#6b7280" fontSize={11} />
                      <Tooltip {...tooltipStyle} />
                      <Legend />
                      <Area type="monotone" dataKey="income" stroke="#10b981" fill="#10b98120" strokeWidth={2} name="Income" />
                      <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="#ef444420" strokeWidth={2} name="Expense" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', color: '#6b7280', padding: '3rem 0' }}>No data yet</div>
                )}
              </div>

              {/* Category Pie */}
              <div style={cardStyle}>
                <h3 style={{ color: '#ffffff', fontWeight: 600, marginBottom: '1rem' }}>
                  🍩 Category Breakdown
                </h3>
                {categories.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={categories} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                        {categories.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip {...tooltipStyle} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', color: '#6b7280', padding: '3rem 0' }}>No data yet</div>
                )}
              </div>
            </div>

            {/* ANALYST and ADMIN - See more charts */}
            {(user?.role === 'ANALYST' || user?.role === 'ADMIN') && (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}>
                  {/* Net Balance Monthly */}
                  <div style={cardStyle}>
                    <h3 style={{ color: '#ffffff', fontWeight: 600, marginBottom: '1rem' }}>
                      📊 Monthly Net Balance
                    </h3>
                    {monthly.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={monthly}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                          <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                          <YAxis stroke="#6b7280" fontSize={11} />
                          <Tooltip {...tooltipStyle} />
                          <Bar dataKey="net" fill="#7c3aed" name="Net Balance" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ textAlign: 'center', color: '#6b7280', padding: '3rem 0' }}>No data yet</div>
                    )}
                  </div>

                  {/* Category Bar Chart */}
                  <div style={cardStyle}>
                    <h3 style={{ color: '#ffffff', fontWeight: 600, marginBottom: '1rem' }}>
                      📉 Category Income vs Expense
                    </h3>
                    {categories.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={categories}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                          <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                          <YAxis stroke="#6b7280" fontSize={11} />
                          <Tooltip {...tooltipStyle} />
                          <Legend />
                          <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ textAlign: 'center', color: '#6b7280', padding: '3rem 0' }}>No data yet</div>
                    )}
                  </div>
                </div>

                {/* Weekly Trends - Only Analyst and Admin */}
                <div style={{ ...cardStyle, marginBottom: '1rem' }}>
                  <h3 style={{ color: '#ffffff', fontWeight: 600, marginBottom: '1rem' }}>
                    📅 Weekly Trends (Last 7 Days)
                  </h3>
                  {weekly.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={weekly}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                        <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
                        <YAxis stroke="#6b7280" fontSize={11} />
                        <Tooltip {...tooltipStyle} />
                        <Legend />
                        <Area type="monotone" dataKey="income" stroke="#10b981" fill="#10b98120" strokeWidth={2} name="Income" />
                        <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="#ef444420" strokeWidth={2} name="Expense" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem 0' }}>
                      No activity in last 7 days
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Recent Activity */}
            <div style={cardStyle}>
              <h3 style={{ color: '#ffffff', fontWeight: 600, marginBottom: '1rem' }}>
                🕐 Recent Activity
              </h3>
              {recent.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Category', 'Type', 'Amount', 'Date', 'By'].map((h) => (
                        <th key={h} style={{
                          textAlign: 'left', padding: '0.75rem',
                          color: '#6b7280', fontSize: '0.75rem',
                          borderBottom: '1px solid #2a2a3a',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((record: any) => (
                      <tr key={record.id} style={{ borderBottom: '1px solid #1a1a24' }}>
                        <td style={{ padding: '0.75rem', color: '#e2e8f0', fontSize: '0.875rem' }}>
                          {record.category}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            padding: '0.2rem 0.6rem', borderRadius: '9999px',
                            fontSize: '0.75rem', fontWeight: 600,
                            backgroundColor: record.type === 'INCOME' ? '#10b98120' : '#ef444420',
                            color: record.type === 'INCOME' ? '#10b981' : '#ef4444',
                          }}>{record.type}</span>
                        </td>
                        <td style={{
                          padding: '0.75rem', fontWeight: 600, fontSize: '0.875rem',
                          color: record.type === 'INCOME' ? '#10b981' : '#ef4444',
                        }}>
                          {formatCurrency(record.amount)}
                        </td>
                        <td style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>
                          {record.user?.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '3rem 0' }}>
                  No recent activity
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}