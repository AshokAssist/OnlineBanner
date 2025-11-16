import { useAuth } from '../hooks/useAuth';

export const DebugUser: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs">
      <div><strong>User Debug:</strong></div>
      <div>ID: {user?.id}</div>
      <div>Email: {user?.email}</div>
      <div>Name: {user?.name}</div>
      <div>isAdmin: {String(user?.isAdmin)}</div>
      <div>Raw: {JSON.stringify(user, null, 2)}</div>
    </div>
  );
};