import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { NewButton, DotsHortlIcon, IconImage } from '../index';
import { Edit, Delete } from '../../assets/Imagesender';
import { deletePurchase, verifyPurchase } from '../../api/purchase.api';
import { canActOnPurchaseRow } from '../../helpers/purchasePermissions';

const PurchaseActions = ({
  id,
  status,
  canEdit = false,
  canDelete = false,
  canVerify = false,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [busy, setBusy] = useState(false);

  const flags = { canEdit, canDelete, canVerify };
  const { showVerify, showMenu } = canActOnPurchaseRow(flags, status);

  if (!showVerify && !showMenu) {
    return null;
  }

  const handleMenuToggle = (e, rowId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === rowId ? null : rowId);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setOpenMenuId(null);
    navigate(`/web/purchase/edit/${id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this draft purchase?')) return;
    setBusy(true);
    try {
      await deletePurchase(id);
      queryClient.invalidateQueries({ queryKey: ['purchase'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-stats'] });
      setOpenMenuId(null);
    } catch (err) {
      alert(err.message || 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Verify this purchase and update stock?')) return;
    setBusy(true);
    try {
      await verifyPurchase(id);
      queryClient.invalidateQueries({ queryKey: ['purchase'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-stats'] });
    } catch (err) {
      alert(err.message || 'Verify failed');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      {showVerify && (
        <NewButton
          size="sm"
          children={busy ? '...' : 'Verify'}
          onClick={handleVerify}
          className="bg-amber-500 hover:bg-amber-700 text-white px-2 py-1"
          disabled={busy}
        />
      )}
      {showMenu && (
        <div className="relative">
          <NewButton
            onClick={(e) => handleMenuToggle(e, id)}
            className="cursor-pointer"
            size="sm"
            noBorder
            noBg
            iconEnd={<DotsHortlIcon />}
            disabled={busy}
          />
          {openMenuId === id && (
            <div className="absolute right-0 top-full z-50 mt-2 w-42 rounded-xl border border-white bg-[#c7c9c7] px-1 py-1 opacity-80 shadow-4xl">
              {canEdit && (
                <NewButton
                  className="w-full cursor-pointer border-lg text-gray-500 hover:bg-gray-400 hover:text-gray-800"
                  noBg
                  noBorder
                  onClick={handleEdit}
                  children="Edit"
                  iconStart={<IconImage src={Edit} />}
                />
              )}
              {canDelete && (
                <NewButton
                  className="w-full cursor-pointer border-lg text-gray-500 hover:bg-red-300 hover:text-red-500"
                  noBg
                  noBorder
                  onClick={handleDelete}
                  children="Delete"
                  iconStart={<IconImage src={Delete} />}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PurchaseActions;
