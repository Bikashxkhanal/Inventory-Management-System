import { useState } from "react";
import { NewButton } from "..";
import { ArrowLeft, Phone } from "lucide-react";

const AddCustomer = ({ onClick, onBack }) => {
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onClick(phone);
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">  
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Customer details</h3>
            <p className="mt-1 text-sm text-slate-500">Enter the customer's phone number for this sale.</p>
          </div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Back to sale items"
            >
              <ArrowLeft size={18} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Phone number</span>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
              <Phone size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="98XXXXXXXX"
                value={phone}
                onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, ""))
                }
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </label>

          <NewButton
            children="Next"
            size="lg"
            className="mt-5 w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700"
            as="button"
          />
        </form>

      </div>
    </div>
  );
};

export default AddCustomer;
