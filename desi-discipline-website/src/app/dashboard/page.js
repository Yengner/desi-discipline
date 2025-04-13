import DashboardPage from '@/components/dashboard/DashboardPage';
import { getUserDailyStats } from '@/lib/getUserDailyStats';


export default async function Dashboard() {

  const data = await getUserDailyStats();

  
  return (
    <div className="p-28">
        <DashboardPage stats={data}/>
    </div>
  );
}
