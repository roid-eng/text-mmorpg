/**
 * auth.js — Login, signup, and session management
 */

const Auth = (() => {
  async function getSession() {
    const { data } = await supabaseClient.auth.getSession();
    return data?.session ?? null;
  }

  async function signUp(email, password, username, language = 'en') {
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) throw error;

    return data;
  }

  async function signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;

    await supabaseClient
      .from('text_mmorpg_players')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);

    return data;
  }

  async function signInAsGuest() {
    const { data, error } = await supabaseClient.auth.signInAnonymously();
    if (error) return { error };

    const user = data.user;
    await supabaseClient
      .from('text_mmorpg_players')
      .upsert({
        id: user.id,
        username: '여행자_' + user.id.slice(0, 6),
        language: 'ko',
        is_guest: true,
      }, { onConflict: 'id', ignoreDuplicates: true });

    return { data };
  }

  async function signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    window.location.reload();
  }

  return { getSession, signUp, signIn, signOut, signInAsGuest };
})();
