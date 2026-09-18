import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRightLeft,
  CreditCard,
  Wallet2,
  X,
} from "lucide-react";
import api from "../api/axiosConfig";
import TransactionList from "../components/TransactionList";
import { useAuth } from "../context/AuthContext";

const formatCurrency = (value) =>
  Number(value ?? 0).toLocaleString("en-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function GroupDetailsPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, availableUsers } = useAuth();
  const groupNameFromState = location.state?.groupName;
  const [wallet, setWallet] = useState({ balance: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalType, setModalType] = useState(null);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState("");
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState("");
  const [roleUpdating, setRoleUpdating] = useState(null);

  const fetchWallet = async () => {
    try {
      const walletResponse = await api.get(`/api/groups/${groupId}/wallet`);
      setWallet(walletResponse.data);
      setError("");
    } catch (err) {
      setError("Unable to load this group wallet right now.");
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get(`/api/groups/${groupId}/transactions`);
      setTransactions(response.data || []);
      setTransactionsError("");
    } catch (err) {
      setTransactions([]);
      setTransactionsError(
        "Unable to load this group's transactions right now.",
      );
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await api.get(`/api/groups/${groupId}/members`);
      setMembers(response.data || []);
      setMembersError("");
    } catch (err) {
      setMembers([]);
      setMembersError("Unable to load this group's members right now.");
    }
  };

  useEffect(() => {
    let ignore = false;

    const fetchGroupData = async () => {
      setLoading(true);
      setError("");

      try {
        setTransactionsLoading(true);
        setMembersLoading(true);
        await Promise.all([fetchWallet(), fetchTransactions(), fetchMembers()]);
      } catch (err) {
        if (!ignore) {
          setError("Unable to load this group wallet right now.");
        }
      } finally {
        setTransactionsLoading(false);
        setMembersLoading(false);
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchGroupData();

    return () => {
      ignore = true;
    };
  }, [groupId]);

  const handleSubmitAction = async (event) => {
    event.preventDefault();

    const numericAmount = Number(amount);
    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setActionMessage("Please enter a valid amount greater than zero.");
      return;
    }

    setSubmitting(true);
    setActionMessage("");

    try {
      await api.post(`/api/groups/${groupId}/${modalType}`, null, {
        params: {
          amount: numericAmount,
        },
      });

      setActionMessage(
        modalType === "deposit"
          ? "Deposit completed successfully."
          : "Expense executed successfully.",
      );
      setAmount("");
      setModalType(null);
      await Promise.all([fetchWallet(), fetchTransactions()]);
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data ||
        "The transaction could not be completed.";
      setActionMessage(backendMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (targetUserId, role) => {
    setRoleUpdating(targetUserId);

    try {
      await api.put(
        `/api/groups/${groupId}/members/${targetUserId}/role`,
        null,
        { params: { role } },
      );
      await fetchMembers();
    } catch (err) {
      setMembersError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "The member role could not be updated.",
      );
    } finally {
      setRoleUpdating(null);
    }
  };

  const quickActions = useMemo(
    () => [
      {
        label: "Deposit",
        icon: CreditCard,
        color: "bg-[#0A7D6B]",
        action: "deposit",
      },
      {
        label: "Expense",
        icon: ArrowRightLeft,
        color: "bg-[#FA9905]",
        action: "expense",
      },
    ],
    [],
  );

  const displayName = groupNameFromState || `Group #${groupId}`;
  const currentMember = members.find(
    (member) => member.userId === currentUser.id,
  );
  const isModerator = currentMember?.roles?.includes("MODERATOR");
  const canExecuteExpense = currentMember?.roles?.includes("TREASURER");

  return (
    <div className="space-y-8 pb-12 pt-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate("/groups")}
          className="inline-flex items-center gap-2 rounded-xl border border-[#0A7D6B]/20 bg-white px-3 py-2 text-sm font-bold text-[#0A7D6B] shadow-sm transition hover:bg-[#E8F6F4]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to groups
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 rounded-xl border border-[#FA9905]/20 bg-[#FFF7ED] px-3 py-2 text-sm font-bold text-[#CB7C04] transition hover:bg-[#FED7A2]"
        >
          Dashboard
        </button>
      </div>

      <div className="rounded-[28px] border border-[#E8F6F4] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#FA9905]">
              Group dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-800">
              {loading ? "Loading..." : displayName}
            </h1>
          </div>

          {error && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
              {error}
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0A7D6B_0%,#07594C_100%)] p-6 text-white shadow-[0_24px_60px_rgba(7,89,76,0.18)]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#E8F6F4]">
              <Wallet2 className="h-4 w-4" />
              Group wallet
            </div>

            <div className="mt-6 flex items-end justify-between gap-3">
              <div className="text-4xl font-black tracking-tight sm:text-[3rem]">
                {loading ? "--" : `${formatCurrency(wallet.balance)} `}
              </div>
              <div className="pb-1 text-lg font-semibold text-[#E8F6F4]">
                EGP
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {quickActions
              .filter(({ action }) => action !== "expense" || canExecuteExpense)
              .map(({ label, icon: Icon, color, action }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setModalType(action)}
                  className={`flex w-full items-center justify-between rounded-2xl ${color} px-4 py-4 text-left text-white shadow-md transition hover:brightness-105`}
                >
                  <span className="text-lg font-bold">{label}</span>
                  <Icon className="h-5 w-5" />
                </button>
              ))}
          </div>
        </div>
      </div>

      <section className="rounded-[28px] border border-[#E8F6F4] bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0A7D6B]">
              Access control
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-800">Members</h2>
          </div>
          <span className="text-sm font-medium text-slate-500">
            {membersLoading
              ? "Loading..."
              : `${members.length} member${members.length === 1 ? "" : "s"}`}
          </span>
        </div>

        {membersError && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
            {membersError}
          </div>
        )}

        {membersLoading ? (
          <div className="rounded-3xl border border-[#E8F6F4] bg-[#F8FCFB] p-8 text-center font-bold text-[#07594C]">
            Loading members...
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#0A7D6B]/25 bg-[#F8FCFB] p-8 text-center text-slate-500">
            No members found.
          </div>
        ) : (
          <div className="divide-y divide-[#E8F6F4]">
            {members.map((member) => {
              const user = availableUsers.find(
                (item) => item.id === member.userId,
              );
              const memberName = user?.name || `User #${member.userId}`;

              return (
                <div
                  key={member.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-800">{memberName}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {member.roles?.map((role) => (
                        <span
                          key={role}
                          className="rounded-full bg-[#E8F6F4] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#07594C]"
                        >
                          {role.toLowerCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isModerator && member.userId !== currentUser.id && (
                    <label className="flex items-center gap-2 text-sm font-bold text-[#07594C]">
                      Role
                      <select
                        value={
                          member.roles?.includes("MODERATOR")
                            ? "MODERATOR"
                            : member.roles?.includes("TREASURER")
                              ? "TREASURER"
                              : "MEMBER"
                        }
                        disabled={roleUpdating === member.userId}
                        onChange={(event) =>
                          handleRoleChange(member.userId, event.target.value)
                        }
                        className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#FA9905] focus:ring-4 focus:ring-[#FED7A2]"
                      >
                        <option value="MEMBER">Member</option>
                        <option value="TREASURER">Treasurer</option>
                        <option value="MODERATOR">Moderator</option>
                      </select>
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-[28px] border border-[#E8F6F4] bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0A7D6B]">
              Group activity
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-800">
              Transaction report
            </h2>
          </div>
          <span className="text-sm font-medium text-slate-500">
            {transactionsLoading
              ? "Loading..."
              : `${transactions.length} record${transactions.length === 1 ? "" : "s"}`}
          </span>
        </div>

        {transactionsError && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
            {transactionsError}
          </div>
        )}

        {transactionsLoading ? (
          <div className="rounded-3xl border border-[#E8F6F4] bg-[#F8FCFB] p-8 text-center font-bold text-[#07594C]">
            Loading transactions...
          </div>
        ) : (
          <TransactionList transactions={transactions} scope="group" />
        )}
      </section>

      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-slate-800">
                {modalType === "deposit"
                  ? "Deposit to Group"
                  : "Create Expense"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setModalType(null);
                  setAmount("");
                  setActionMessage("");
                }}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAction} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="amount"
                  className="mb-2 block text-sm font-bold text-[#07594C]"
                >
                  Amount (EGP)
                </label>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="2500"
                  className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-slate-800 outline-none transition focus:border-[#FA9905] focus:ring-4 focus:ring-[#FED7A2]"
                />
              </div>

              {actionMessage && (
                <div
                  className={`rounded-2xl px-3 py-2 text-sm font-medium ${
                    actionMessage.toLowerCase().includes("success")
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {actionMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[#0A7D6B] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#0A7D6B]/20 transition hover:bg-[#07594C] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting
                  ? "Processing..."
                  : modalType === "deposit"
                    ? "Confirm Deposit"
                    : "Confirm Expense"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupDetailsPage;
