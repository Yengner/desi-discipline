'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { handleSignOut } from '@/lib/user.actions';

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    const { errorMessage } = await handleSignOut();

    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      router.push('/login');
      toast.success("Signed Out!");
    }

    setLoading(false);
  };

  return (
    <img
      src="/image-10.png"
      alt="Logout"
      onClick={handleLogout}
      className="logout-image-button"
      style={{
        width: '40px',
        height: '40px',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.5 : 1,
        transition: 'transform 0.2s ease',
      }}
    />
  );
};

export default LogoutButton;

