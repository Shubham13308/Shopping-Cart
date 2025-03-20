import React from "react";
import "../../css/admin/ProfileOverlap.css";
import { BASEURL } from "../../Auth/Matcher";

const ProfileOverlap = ({ users, setUserName }) => {
  

  if (!users || users.length === 0) {
    return <div className="no-users-message"></div>; 
  }

  return (
<div className="profile-container">
  {users.map((user) => (
    <div key={user.admin_username} className="profile-avatar">
      <img
        src={`${BASEURL}/${user.profileImage}`}
        alt={user.admin_username}
        className="avatar"
        onClick={() => setUserName(user.admin_username)}
      />
    
      <div className={`dot ${user.status === "nonactive" ? 'red-dot' : 'green-dot'}`}></div>
    </div>
  ))}
</div>

  );
};

export default ProfileOverlap;
