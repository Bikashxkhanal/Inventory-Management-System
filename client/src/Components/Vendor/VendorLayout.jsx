import {
  NewButton,
  VendorFilterBar,
  VendorGeneralInfoBar,
  VendorInfoTable,
  VendorTitle,
} from "./../index";

const VendorLayout = () => {
  return (
    <div className="flex-1 mx-4 mt-8 ">
      <div className="w-full flex flex-row justify-between mt-15 md:mt-5 mb-4">
        <VendorTitle />
        <NewButton />
      </div>
      <VendorGeneralInfoBar />
      <VendorFilterBar />
      <VendorInfoTable />
    </div>
  );
};

export default VendorLayout;
