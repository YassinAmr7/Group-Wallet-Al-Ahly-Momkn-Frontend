import { ArrowDownLeft, ArrowUpRight, ReceiptText } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const formatCurrency = (value) =>
  Number(value ?? 0).toLocaleString("en-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (value) => {
  if (!value) return "Unknown date";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown date"
    : date.toLocaleString("en-EG", {
        dateStyle: "medium",
        timeStyle: "short",
      });
};

const transactionLabels = {
  TOP_UP: "Personal top up",
  DEPOSIT: "Group deposit",
  EXPENSE: "Group expense",
};

function TransactionList({ transactions, scope = "personal" }) {
  const { availableUsers } = useAuth();

  if (!transactions.length) {
    return (
      <div className="rounded-3xl border border-dashed border-[#0A7D6B]/25 bg-[#F8FCFB] p-8 text-center">
        <ReceiptText className="mx-auto h-9 w-9 text-[#0A7D6B]" />
        <p className="mt-3 font-bold text-slate-700">No transactions yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Completed wallet activity will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[#E8F6F4] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-160 text-left">
          <thead className="bg-[#F8FCFB] text-xs uppercase tracking-[0.16em] text-[#07594C]">
            <tr>
              <th className="px-5 py-4 font-bold">Activity</th>
              <th className="px-5 py-4 font-bold">Amount</th>
              <th className="px-5 py-4 font-bold">Performed by</th>
              <th className="px-5 py-4 font-bold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8F6F4]">
            {transactions.map((transaction) => {
              const isIncoming =
                transaction.type === "TOP_UP" ||
                (scope === "group" && transaction.type === "DEPOSIT");
              const type =
                transactionLabels[transaction.type] ||
                transaction.type ||
                "Transaction";
              const performedBy = availableUsers.find(
                (user) => user.id === transaction.performedByUserId,
              );

              return (
                <tr key={transaction.id} className="text-sm text-slate-700">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          isIncoming
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-orange-50 text-[#CB7C04]"
                        }`}
                      >
                        {isIncoming ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </span>
                      <span className="font-bold text-slate-800">{type}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-black text-slate-800">
                    {formatCurrency(transaction.amount)} EGP
                  </td>
                  <td className="px-5 py-4">
                    {performedBy?.name ||
                      (transaction.performedByUserId
                        ? `User #${transaction.performedByUserId}`
                        : "-")}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                    {formatDate(transaction.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionList;
