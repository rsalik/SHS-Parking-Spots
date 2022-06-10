export async function handleGoogleResponse(token: any) {
  const res = await fetch('http://localhost:3001/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: token }),
  });

  const { user, expires, error } = await res.json();

  // TODO Implement Error
  if (error) return;

  window.location.href = '/map';
  window.localStorage.setItem('user', JSON.stringify(user));
  window.localStorage.setItem('expires', expires.toString());
  return user;
}

export function getUser() {
  let expires = window.localStorage.getItem('expires');

  if (!expires) return null;
  if (new Date(expires) < new Date()) {
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('expires');
    logOut();
    return null;
  }

  let user = window.localStorage.getItem('user');

  if (user) return JSON.parse(user);

  return null;
}

export function logOut() {
  window.localStorage.removeItem('user');
  window.location.href = '/';
}
