'use client';

import { useState, useEffect } from 'react';
import { getAllUsers, updateUserStatus, UserItem } from '@/lib/adminApi';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Failed to load users:', err);
      setError(err.message || 'Failed to fetch user list from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Action: Toggle Status (ACTIVE <-> BLOCKED)
  const handleToggleStatus = async (user: UserItem) => {
    const nextStatus: 'ACTIVE' | 'BLOCKED' = user.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';

    try {
      await updateUserStatus(user.id, nextStatus);
      
      // Update UI state upon success
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update user status');
    }
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalLandlords = users.filter((u) => u.role === 'LANDLORD').length;
  const totalTenants = users.filter((u) => u.role === 'TENANT').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Admin Control Center</h1>
        <p className="text-slate-500 text-sm mt-1">Manage user accounts and status permissions.</p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Accounts</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Landlords</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{totalLandlords}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Tenants</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{totalTenants}</p>
        </div>
      </div>

      {/* User Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">User Management</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
            >
              <option value="ALL">All Roles</option>
              <option value="TENANT">Tenants</option>
              <option value="LANDLORD">Landlords</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="m-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No users found matching your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-900">{user.name || 'Unnamed User'}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'BLOCKED'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {user.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                          user.status === 'BLOCKED'
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}
                      >
                        {user.status === 'BLOCKED' ? 'Unblock Account' : 'Block Account'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}