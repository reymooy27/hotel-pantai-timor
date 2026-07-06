import { RoomsManager } from "@/components/admin/rooms-manager";
import { getRooms } from "@/lib/admin-data";

export default async function AdminRoomsPage() {
  const rooms = await getRooms();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h1 className="text-2xl font-semibold text-white">Rooms</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage room visibility and update core pricing details.
        </p>

        <RoomsManager rooms={rooms} />
      </section>
    </div>
  );
}
