import { ActionButton } from "@/components/admin/action-button";
import { formatDate } from "@/lib/admin-config";
import { getFirstValue, reviewStatusLabel } from "@/lib/admin-config";
import { getReviews } from "@/lib/admin-data";

type ReviewsPageProps = {
  searchParams: Promise<{ status?: string | string[] }>;
};

export default async function AdminReviewsPage({
  searchParams,
}: ReviewsPageProps) {
  const filters = await searchParams;
  const status = getFirstValue(filters.status, "all");
  const reviews = await getReviews(status);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Reviews moderation</h1>
            <p className="mt-1 text-sm text-slate-400">
              Approve guest testimonials before they appear on public pages.
            </p>
          </div>
          <form>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Filter
              </span>
              <select
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                defaultValue={status}
                name="status"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            </label>
            <button
              className="mt-3 rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              type="submit"
            >
              Apply
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5"
              key={review.id}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">{review.guest_name}</h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                        review.is_approved
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-yellow-500/15 text-yellow-300"
                      }`}
                    >
                      {reviewStatusLabel(review)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    {formatDate(review.created_at)} • {review.rating}/5 stars
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <ActionButton
                    body={{ is_approved: true }}
                    className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                    endpoint={`/api/admin/reviews/${review.id}`}
                    method="PATCH"
                  >
                    Approve
                  </ActionButton>
                  <ActionButton
                    body={{ is_approved: false }}
                    className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200"
                    endpoint={`/api/admin/reviews/${review.id}`}
                    method="PATCH"
                  >
                    Reject
                  </ActionButton>
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                {review.comment ?? "No written review."}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
