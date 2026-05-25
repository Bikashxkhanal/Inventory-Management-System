import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, UserCog } from 'lucide-react';
import { fetchStaffById, updateStaff } from '../../../api/staff.api';
import { useToast } from '../../../context/ToastContext';

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'salesperson', label: 'Salesperson' },
];

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20';

const UpdateStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['staff-detail', id],
    queryFn: () => fetchStaffById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setForm({
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        email: data.email ?? '',
        phoneNumber: data.phoneNumber ?? '',
        role: data.role ?? '',
      });
    }
  }, [data]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await updateStaff(id, form);
      showToast(res?.message || 'Staff updated', 'success');
      navigate('/web/staff');
    } catch (err) {
      showToast(err?.message || 'Update failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center text-slate-500">
        Loading staff…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          {error?.message || 'Could not load staff'}
        </p>
        <Link to="/web/staff" className="mt-4 inline-block text-sm text-violet-600">
          Back to staff
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <Link
        to="/web/staff"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to staff
      </Link>

      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          <UserCog size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Update staff</h1>
          <p className="text-sm text-slate-500">Staff ID #{id}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600">
              First name
            </span>
            <input
              required
              className={fieldClass}
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600">
              Last name
            </span>
            <input
              required
              className={fieldClass}
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-slate-600">Email</span>
            <input
              required
              type="email"
              className={fieldClass}
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600">Phone</span>
            <input
              required
              type="tel"
              className={fieldClass}
              value={form.phoneNumber}
              onChange={(e) => update('phoneNumber', e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600">Role</span>
            <select
              required
              className={fieldClass}
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/web/staff')}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateStaff;
