import { Account } from '../components/component/Account';
import { UserList } from '../components/component/Users';
import { useAuth } from '../hooks/useAuth';

export function Home() {
  const { role } = useAuth();
  return <div>{role === 'admin' ? <UserList /> : <Account />}</div>;
}
