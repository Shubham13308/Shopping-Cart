import React from 'react';
import PropTypes from 'prop-types';
import { BASEURL } from '../../Auth/Matcher';
import '../../css/ui/ProfileAvatar.css'; 

const ProfileAvatar = ({ photoUrl, altText = 'User Avatar' }) => {
  return (
    <img
      src={`${BASEURL}/${photoUrl}`}
      alt={altText}
      className="profile-avatar"
    />
  );
};

ProfileAvatar.propTypes = {
  photoUrl: PropTypes.string.isRequired,
  altText: PropTypes.string,
};

export default ProfileAvatar;
