import { MonthGrid } from "@/components/admin/month-grid";
import { BlocksManager } from "@/components/admin/blocks-manager";
import { roomBlocksToCalendarEvents } from "@/lib/admin-config";
import { getRoomBlocks, getRooms } from "@/lib/admin-data";

export default async function AdminBlocksPage() {
  const [blocks, rooms] = await Promise.all([getRoomBlocks(), getRooms()]);

  return (
    <div className="space-y-6">
      <BlocksManager blocks={blocks} rooms={rooms} />

      <MonthGrid events={roomBlocksToCalendarEvents(blocks)} />
    </div>
  );
}
