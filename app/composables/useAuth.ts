export const useAuth = () => {
  const { $supabase } = useNuxtApp();
  const user = useState("user", () => null);

  const getUser = async () => {
    const { data } = await $supabase.auth.getUser();
    user.value = data.user;
  };

  const signIn = async (email: string, password: string) => {
    return $supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string) => {
    return $supabase.auth.signUp({ email, password });
  };

  const signOut = async () => {
    await $supabase.auth.signOut();
    user.value = null;
  };

  return { user, getUser, signIn, signUp, signOut };
};
