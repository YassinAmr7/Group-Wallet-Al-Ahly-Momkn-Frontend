import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle } from "lucide-react";
import api from "../api/axiosConfig";

function CreateGroupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Please enter a group name.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await api.post("/api/groups", null, {
        params: {
          name: name.trim(),
        },
      });

      const newGroup = response.data;
      navigate(`/groups/${newGroup.id}`, {
        state: { groupName: newGroup.name },
      });
    } catch (err) {
      const message =
        err?.response?.data?.message || "Unable to create group right now.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl pb-12 pt-4">
      <button
        type="button"
        onClick={() => navigate("/groups")}
        className="inline-flex items-center gap-2 rounded-xl border border-[#0A7D6B]/20 bg-white px-3 py-2 text-sm font-bold text-[#0A7D6B] shadow-sm transition hover:bg-[#E8F6F4]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to groups
      </button>

      <div className="mt-6 rounded-[28px] border border-[#E8F6F4] bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#FA9905]">
            New group
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-800">
            Create a group
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="groupName"
              className="mb-2 block text-sm font-bold text-[#07594C]"
            >
              Group name
            </label>
            <input
              id="groupName"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter a group name"
              className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-slate-800 outline-none transition focus:border-[#FA9905] focus:ring-4 focus:ring-[#FED7A2]"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0A7D6B] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#0A7D6B]/20 transition hover:bg-[#07594C] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <PlusCircle className="h-4 w-4" />
            {submitting ? "Creating..." : "Create group"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateGroupPage;
