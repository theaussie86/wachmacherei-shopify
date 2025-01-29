import { signInWithGoogle } from 'actions';

function LoginForm() {
  return (
    <form action={signInWithGoogle}>
      <button
        className="bg-secondary px-3.5 py-2.5 font-semibold text-white shadow-sm hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        type="submit"
        name="action"
        value="google"
      >
        Einloggen
      </button>
    </form>
  );
}

export default LoginForm;
