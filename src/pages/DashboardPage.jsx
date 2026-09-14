import { useEffect, useState } from "react";
import { Plus, Wallet2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";

const formatCurrency = (value) =>
  Number(value ?? 0).toLocaleString("en-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function DashboardPage() {
  const { currentUser } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    api
      .get("/wallet")
      .then((res) => {
        if (!ignore) setWallet(res.data);
      })
      .catch((error) => {
        if (!ignore) console.error("Failed to fetch wallet", error);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [currentUser.id]);

  const balance = wallet?.balance ?? 4600;

  return (
    <div className="flex flex-col items-center pb-12 pt-8">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-3xl font-black tracking-tight text-[#0A7D6B] sm:text-4xl">
          Welcome back, {currentUser.name}
        </h1>
        <p className="mt-3 text-base text-[#07594C] opacity-80">
          Here is the status of your personal wallet.
        </p>
      </div>

      <div className="mt-10 w-full max-w-md overflow-hidden rounded-[28px] border border-[#FED7A2] bg-[linear-gradient(135deg,#FA9905_0%,#CB7C04_100%)] shadow-[0_24px_60px_rgba(202,124,4,0.22)]">
        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-[#FFF7ED]">
            <Wallet2 className="h-4 w-4" />
            Personal Wallet
          </div>

          <div className="mt-8 flex items-end justify-between gap-3 text-white">
            <div className="text-4xl font-black tracking-tight sm:text-[3.1rem]">
              {loading ? "--" : formatCurrency(balance)}
            </div>
            <div className="pb-1 text-xl font-semibold text-[#FFF7ED]">EGP</div>
          </div>

          <button
            type="button"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0A7D6B] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#07594C]/20 transition hover:-translate-y-0.5 hover:bg-[#07594C]"
          >
            <Plus className="h-4 w-4" />
            Add Funds
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
