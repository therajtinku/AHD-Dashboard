import { DashboardProvider } from './hooks/useDashboard';
import { Layout } from './components/Layout';
import { FiltersBar } from './components/FiltersBar';
import { TopPerformers } from './components/TopPerformers';
import { LeaderboardTable } from './components/LeaderboardTable';
import { DataControls } from './components/DataControls';

function App() {
  return (
    <DashboardProvider>
      <Layout>
        <DataControls />
        <FiltersBar />
        <TopPerformers />
        <LeaderboardTable />
      </Layout>
    </DashboardProvider>
  );
}

export default App;
