import AdminNav from '../components/admin/AdminNav';

export const metadata = {
  title: 'Admin - Kesä Perhonen',
  description: 'Kesä Perhonen Administor Dashboard',
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
};

export default AdminLayout;
