import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { createStaff } from '../../../api/staff.api';
import { useToast } from '../../../context/ToastContext';

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'salesperson', label: 'Salesperson' },
];

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20';

const CreateStaff = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
    password: '',
  });

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setOutcome(null);
    try {
      const res = await createStaff(form);
      const msg =
        res?.message ||
        'Staff created successfully. Pending accounts need superadmin approval.';
      setOutcome({ type: 'success', message: msg });
      showToast(msg, 'success');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: '',
        password: '',
      });
    } catch (err) {
      const msg = err?.message || 'Could not create staff';
      setOutcome({ type: 'error', message: msg });
      showToast(msg, 'error');
    } finally {
      setBusy(false);
    }
  };

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
          <UserPlus size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add staff member</h1>
          <p className="text-sm text-slate-500">
            Accounts created by admin or manager require superadmin approval.
          </p>
        </div>
      </div>

      {outcome && (
        <div
          className={`mb-6 flex gap-3 rounded-xl border px-4 py-4 ${
            outcome.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-red-200 bg-red-50 text-red-900'
          }`}
        >
          {outcome.type === 'success' ? (
            <CheckCircle2 className="shrink-0" size={22} />
          ) : (
            <AlertCircle className="shrink-0" size={22} />
          )}
          <div>
            <p className="font-semibold">
              {outcome.type === 'success' ? 'Staff added' : 'Could not add staff'}
            </p>
            <p className="mt-1 text-sm">{outcome.message}</p>
            {outcome.type === 'success' && (
              <button
                type="button"
                onClick={() => navigate('/web/staff')}
                className="mt-3 text-sm font-medium underline"
              >
                View staff list
              </button>
            )}
          </div>
        </div>
      )}

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
              <option value="">Select role</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-slate-600">
              Password
            </span>
            <input
              required
              type="password"
              minLength={6}
              className={fieldClass}
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/web/staff')}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {busy ? 'Creating…' : 'Create staff'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStaff;
