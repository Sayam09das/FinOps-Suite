import { useProtectedRoute } from '../hooks/useProtectedRoute';
import DashHomeDashboard from './components/DashHome/DashHomeDashboard';

export default function DashboardPage() {
  useProtectedRoute();
  return <DashHomeDashboard />;
}
