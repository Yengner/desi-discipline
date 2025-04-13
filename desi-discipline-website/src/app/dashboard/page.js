import DashboardPage from '@/components/dashboard/DashboardPage';
import { getUserDailyStats } from '@/lib/getUserDailyStats';

// const data = await getUserDailyStats();

export default async function Dashboard() {
  return (
    <div className="p-28">
        <DashboardPage stats={data}/>
    </div>
  );
}
