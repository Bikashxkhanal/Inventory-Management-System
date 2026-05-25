import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStaff } from '../../api/staff.api';
import PaginationController from '../PaginationControls/PaginationController';
import StaffActions from './StaffActions';

const formatJoined = (row) => {
  if (!row.joinedAt) return '—';
  const d = new Date(row.joinedAt);
  if (Number.isNaN(d.getTime())) return String(row.joinedAt);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const statusLabel = (status, isVerified) => {
  const s = String(status ?? '').toLowerCase();
  if (s === 'pending' || isVerified === 0 || isVerified === '0') return 'Pending';
  if (s === 'inactive') return 'Inactive';
  return 'Active';
};

const statusClass = (status, isVerified) => {
  const label = statusLabel(status, isVerified);
  if (label === 'Pending') return 'bg-amber-100 text-amber-800';
  if (label === 'Inactive') return 'bg-slate-100 text-slate-600';
  return 'bg-emerald-100 text-emerald-800';
};

const StaffInfoTable = ({ filters }) => {
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['staff', page, limit, filters],
    queryFn: () =>
      fetchStaff({
        page,
        limit,
        q: filters?.q,
        role: filters?.role,
        join_from: filters?.join_from,
        join_to: filters?.join_to,
      }),
    keepPreviousData: true,
  });

  const staffData = Array.isArray(data?.data) ? data.data : [];
  const totalPages = data?.meta?.total_pages ?? data?.meta?.totalPages ?? 1;

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-slate-500">
        Loading staff…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center text-red-700">
        {error?.message || 'Failed to load staff'}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-600">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffData.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                  No staff found
                </td>
              </tr>
            ) : (
              staffData.map((staff) => (
                <tr
                  key={staff.id}
                  className="border-b border-slate-100 hover:bg-slate-50/80"
                >
                  <td className="px-4 py-3 font-mono text-slate-600">{staff.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {staff.firstName} {staff.lastName}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{staff.email}</td>
                  <td className="px-4 py-3 capitalize">{staff.role}</td>
                  <td className="px-4 py-3">{staff.phoneNumber}</td>
                  <td className="px-4 py-3 text-slate-600">{formatJoined(staff)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass(
                        staff.status,
                        staff.isVerified
                      )}`}
                    >
                      {statusLabel(staff.status, staff.isVerified)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StaffActions staff={staff} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="border-t border-slate-100 px-4 py-3">
          <PaginationController
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default StaffInfoTable;
