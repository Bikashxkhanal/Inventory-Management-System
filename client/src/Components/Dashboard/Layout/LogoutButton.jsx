import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { LogOut } from 'lucide-react';
import { logout } from '../../../Stores/authThunk';
import ConfirmDialog from '../../Common/ConfirmDialog';

function LogoutButton() {
  const dispatch = useDispatch();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmLogout = async () => {
    setLoading(true);
    try {
      await dispatch(logout());
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="flex w-full cursor-pointer flex-row items-center justify-center gap-3 rounded-lg px-4 py-2.5 text-white transition hover:bg-white/10"
      >
        <span className="text-sm font-medium">Logout</span>
        <LogOut className="h-4 w-4 shrink-0 text-white" strokeWidth={2} aria-hidden />
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Log out?"
        message="You will need to sign in again to access the dashboard."
        confirmLabel="Log out"
        cancelLabel="Stay signed in"
        variant="primary"
        loading={loading}
        onCancel={() => !loading && setConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}

export default LogoutButton;
