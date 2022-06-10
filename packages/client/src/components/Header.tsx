import { useEffect, useState } from 'react';
import { getUser, logOut } from '../auth/googleAuth';

export default function Header() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    picture: string;
  }>();

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <div className="header">
      <div className="title">SHS Parking Spot Sign Up</div>
      {user && (
        <div className="user">
          <div className="name">
            {user.name}
            <span className="logout" onClick={logOut}>
              Log Out
            </span>
          </div>
          <div className="pfp">
            <img src={user.picture} alt="Profile" />
          </div>
        </div>
      )}
    </div>
  );
}
