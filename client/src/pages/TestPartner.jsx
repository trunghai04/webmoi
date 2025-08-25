import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const TestPartner = () => {
  const { user, isAuthenticated, isReady } = useContext(AuthContext);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  if (user?.role !== 'partner' && user?.role !== 'admin') {
    return (
      <div className="p-6">
        <h1>Access Denied</h1>
        <p>Current role: {user?.role}</p>
        <p>You need partner or admin role to access this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1>Partner Test Page</h1>
      <p>User: {user?.username}</p>
      <p>Role: {user?.role}</p>
      <p>Email: {user?.email}</p>
      <div className="mt-4 p-4 bg-green-100 rounded-lg">
        <h2>✅ Success!</h2>
        <p>You can access partner pages.</p>
      </div>
    </div>
  );
};

export default TestPartner;
