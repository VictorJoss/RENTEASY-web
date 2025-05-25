import ListaUsuarios from '@/components/admin/ListaUsuarios';
import AdminDashboardFrame from '@/frames/AdminDashboardFrame';

export default function AdminDashboardPage() {
  return (
    <AdminDashboardFrame>
      <ListaUsuarios />
    </AdminDashboardFrame>
  );
}
