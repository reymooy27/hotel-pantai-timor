import { MonthGrid } from "@/components/admin/month-grid";
import { PricingManager } from "@/components/admin/pricing-manager";
import { pricingRulesToCalendarEvents } from "@/lib/admin-config";
import { getPricingRules } from "@/lib/admin-data";

export default async function AdminPricingPage() {
  const rules = await getPricingRules();

  return (
    <div className="space-y-6">
      <PricingManager rules={rules} />

      <MonthGrid events={pricingRulesToCalendarEvents(rules)} />
    </div>
  );
}
