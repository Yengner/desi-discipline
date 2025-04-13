import DashboardPage from '@/components/dashboard/DashboardPage';
import { getUserDailyStats } from '@/lib/getUserDailyStats';
import { getUserWeeklyInsights } from '@/lib/getUserWeeklyInsights';
import { getLoggedInUser } from '@/lib/user.actions';


export default async function Dashboard() {

  const data = await getUserDailyStats();
  const weekly_data = await getUserWeeklyInsights();
  const loggedIn = await getLoggedInUser();
  const username = loggedIn?.username


  return (
    <div className="p-28">
        <DashboardPage username={username} stats={data} weekly_data={weekly_data}/>
    </div>
  );
}
