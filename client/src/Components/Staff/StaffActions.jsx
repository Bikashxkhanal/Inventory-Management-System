import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import {
  softDeleteStaff,
  approveStaff,
  rejectStaff,
} from '../../api/staff.api';
import { useToast } from '../../context/ToastContext';
import { canDeleteStaff, isSuperadmin } from '../../helpers/roleAccess';
import { useNavigate } from 'react-router-dom';
import StaffConfirmDialog from './StaffConfirmDialog';

const StaffActions = ({ staff }) => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [busy, setBusy] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const isPending =
    String(staff.status ?? '').toLowerCase() === 'pending' ||
    staff.isVerified === 0 ||
    staff.isVerified === '0';

  const run = async (fn, okMsg) => {
    setBusy(true);
    try {
      await fn();
      showToast(okMsg, 'success');
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['staffStats'] });
    } catch (e) {
      showToast(e?.message || 'Action failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleRemoveConfirm = () => {
    run(async () => {
      await softDeleteStaff(staff.id);
      setConfirmRemove(false);
    }, 'Staff removed from list');
  };

  if (!canDeleteStaff(role) && !isSuperadmin(role)) {
    return <span className="text-slate-400">—</span>;
  }

  const fullName = `${staff.firstName ?? ''} ${staff.lastName ?? ''}`.trim();

  return (
    <>
      <div className="flex flex-wrap gap-1">
        {isSuperadmin(role) && isPending && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => approveStaff(staff.id), 'Staff approved')}
              className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700"
            >
              Approve
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => rejectStaff(staff.id), 'Staff rejected')}
              className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
            >
              Reject
            </button>
          </>
        )}
        {canDeleteStaff(role) && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => navigate(`/web/staff/update/${staff.id}`)}
              className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setConfirmRemove(true)}
              className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
            >
              Remove
            </button>
          </>
        )}
      </div>

      <StaffConfirmDialog
        open={confirmRemove}
        title="Remove staff member?"
        message={`Remove ${fullName || 'this staff member'} from the list? They will no longer appear in staff views. This does not permanently delete database records.`}
        confirmLabel="Remove"
        variant="danger"
        loading={busy}
        onCancel={() => !busy && setConfirmRemove(false)}
        onConfirm={handleRemoveConfirm}
      />
    </>
  );
};

export default StaffActions;
