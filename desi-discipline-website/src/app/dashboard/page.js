import DashboardPage from '@/components/dashboard/DashboardPage';
import { getUserDailyStats } from '@/lib/getUserDailyStats';
import { getUserWeeklyInsights } from '@/lib/getUserWeeklyInsights';


export default async function Dashboard() {

  const data = await getUserDailyStats();
  const weekly_data = await getUserWeeklyInsights();

  return (
    <div className="p-28">
        <DashboardPage stats={data} weekly_data={weekly_data}/>
    </div>
  );
}
