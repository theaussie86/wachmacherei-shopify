import { signOut } from 'actions';
import { auth } from 'lib/auth';

async function LogoutForm() {
  const session = await auth();
  if (!session) return null;
  return (
    <form className="flex items-center gap-4" action={signOut}>
      <div>Eingeloggt als {session?.user?.email}</div>
      <button
        className="bg-secondary px-3.5 py-2.5 font-semibold text-white shadow-sm hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        type="submit"
        name="action"
        value="google"
      >
        Abmelden
      </button>
    </form>
  );
}

export default LogoutForm;
