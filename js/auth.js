/**
 * auth.js — Login, signup, and session management
 */

const Auth = (() => {
  async function getSession() {
    const { data } = await supabase.auth.getSession();
    return data?.session ?? null;
  }

  async function signUp(email, password, username, language = 'en') {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    const { error: profileError } = await supabase
      .from('text_mmorpg_players')
      .insert({ id: data.user.id, username, language });
    if (profileError) throw profileError;

    return data;
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    await supabase
      .from('text_mmorpg_players')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);

    return data;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.reload();
  }

  return { getSession, signUp, signIn, signOut };
})();
