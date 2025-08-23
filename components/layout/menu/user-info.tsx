'use client';

import { signOut } from 'actions';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const UserInfo = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = () => {
    signOut().then(() => router.push('/'));
  };

  if (session?.user) {
    return (
      <div className="flex items-center gap-4 text-sm text-secondary">
        <span className="hidden md:block">
          Eingeloggt als <span className="font-medium">{session.user.email}</span>
        </span>
        <button
          onClick={handleSignOut}
          className="rounded bg-secondary px-3 py-2 font-medium text-primary hover:bg-secondary/80"
        >
          Abmelden
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/api/auth/signin"
      className="rounded bg-secondary px-3 py-2 font-medium text-primary hover:bg-secondary/80"
    >
      Anmelden
    </Link>
  );
};

export default UserInfo;
