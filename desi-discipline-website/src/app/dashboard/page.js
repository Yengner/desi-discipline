import DashboardPage from '@/components/dashboard/DashboardPage';
import { getUserDailyStats } from '/Users/yb/Desktop/desi/desi-discipline/desi-discipline-website/src/lib/getUserDailyStats.js';

const data = await getUserDailyStats();

export default async function Dashboard() {
  return (
    <div className="p-28">
        <DashboardPage stats={data}/>
    </div>
  );
}
