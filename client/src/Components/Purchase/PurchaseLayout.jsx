import {
  NewButton,
  IconImage,
  PurchaseInfoTable,
  PurchaseTitle,
} from '../index';
import { Add } from '../../assets/Imagesender';
import PurchaseCountBar from './PurchaseCountBar';
import { useSelector } from 'react-redux';
import {
  getPurchaseActionFlags,
  hasPermission,
  normalizeKey,
} from '../../helpers/purchasePermissions';

const PurchaseLayout = () => {
  const { permissions, user } = useSelector((state) => state.auth);
  getPurchaseActionFlags(user, permissions);
  const role = normalizeKey(user?.role);
  const canCreate =
    hasPermission(permissions, 'create_purchase', 'CREATE_PURCHASE') ||
    ['admin', 'superadmin', 'manager'].includes(role);

  return (
    <div className="page-content mt-6 flex-1 pb-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <PurchaseTitle />
          <p className="mt-1 text-sm text-slate-500">
            Review pending purchases, verify to update stock, or reject invalid orders.
          </p>
        </div>
        {canCreate && (
          <NewButton
            as="a"
            href="/web/purchase/create"
            children="New purchase"
            className="shrink-0 bg-emerald-600 hover:bg-emerald-800"
            iconStart={<IconImage src={Add} />}
          />
        )}
      </div>
      <PurchaseCountBar />
      <PurchaseInfoTable />
    </div>
  );
};

export default PurchaseLayout;
