import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  deletePurchase,
  verifyPurchase,
  rejectPurchase,
} from '../../api/purchase.api';
import PurchaseConfirmDialog from './PurchaseConfirmDialog';
import { useToast } from '../../context/ToastContext';

const PurchaseActionsMenu = ({
  id,
  status,
  vendor = '',
  totalAmount = 0,
  canEdit = false,
  canDelete = false,
  canVerify = false,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState(null);

  const isDraft = String(status ?? '').toLowerCase() === 'draft';
  const canReject = canVerify;
  const hasAny =
    isDraft && (canVerify || canReject || canEdit || canDelete);

  useEffect(() => {
    const onOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['purchase'] });
    queryClient.invalidateQueries({ queryKey: ['purchase-stats'] });
  };

  const runAction = async (fn) => {
    setBusy(true);
    try {
      await fn();
      invalidate();
      setDialog(null);
      setOpen(false);
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  const closeDialog = () => {
    if (!busy) setDialog(null);
  };

  const handleRejectConfirm = () => {
    runAction(async () => {
      const result = await rejectPurchase(id);
      if (result?.status === 'rejected') {
        showToast('Purchase rejected', 'success');
      } else if (result?.status === 'removed') {
        showToast('Draft purchase removed', 'info');
      } else {
        showToast('Purchase rejected', 'success');
      }
    });
  };

  if (!hasAny) {
    return <span className="text-xs text-slate-400">—</span>;
  }

  const menuItem = (label, onClick, className = '') => (
    <button
      type="button"
      disabled={busy}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors disabled:opacity-50 ${className}`}
    >
      {label}
    </button>
  );

  return (
    <>
      <div className="relative inline-block" ref={menuRef}>
        <button
          type="button"
          disabled={busy}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <span>Actions</span>
          <svg
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 bg-slate-50 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Purchase #{id}
              </p>
              <p className="truncate text-sm text-slate-700">{vendor}</p>
            </div>

            {(canVerify || canReject) && (
              <div className="border-b border-slate-100 p-1.5">
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Approval
                </p>
                {canVerify &&
                  menuItem(
                    '✓  Verify & update stock',
                    () =>
                      setDialog({
                        type: 'verify',
                        title: 'Verify purchase',
                        message: `Approve purchase #${id} for ${vendor}? Stock will be increased.`,
                        variant: 'primary',
                        confirmLabel: 'Verify',
                      }),
                    'text-emerald-700 hover:bg-emerald-50'
                  )}
                {canReject &&
                  menuItem(
                    '✕  Reject purchase',
                    () =>
                      setDialog({
                        type: 'reject',
                        title: 'Reject purchase',
                        message: `Reject purchase #${id}? It will be marked rejected and will not affect stock.`,
                        variant: 'danger',
                        confirmLabel: 'Reject',
                      }),
                    'text-red-700 hover:bg-red-50'
                  )}
              </div>
            )}

            {(canEdit || canDelete) && (
              <div className="p-1.5">
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Manage
                </p>
                {canEdit &&
                  menuItem(
                    '✎  Edit details',
                    () => {
                      setOpen(false);
                      navigate(`/web/purchase/edit/${id}`);
                    },
                    'text-blue-700 hover:bg-blue-50'
                  )}
                {canDelete &&
                  menuItem(
                    '🗑  Delete draft',
                    () =>
                      setDialog({
                        type: 'delete',
                        title: 'Delete purchase',
                        message: `Permanently delete draft purchase #${id}? This cannot be undone.`,
                        variant: 'danger',
                        confirmLabel: 'Delete',
                      }),
                    'text-slate-700 hover:bg-red-50 hover:text-red-700'
                  )}
              </div>
            )}
          </div>
        )}
      </div>

      <PurchaseConfirmDialog
        open={!!dialog}
        title={dialog?.title}
        message={dialog?.message}
        variant={dialog?.variant}
        confirmLabel={dialog?.confirmLabel}
        loading={busy}
        onCancel={closeDialog}
        onConfirm={() => {
          if (dialog?.type === 'verify') {
            runAction(() => verifyPurchase(id));
          } else if (dialog?.type === 'reject') {
            handleRejectConfirm();
          } else if (dialog?.type === 'delete') {
            runAction(() => deletePurchase(id));
          }
        }}
      />
    </>
  );
};

export default PurchaseActionsMenu;
