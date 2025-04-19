import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <img src={user.profileImage} alt={user.name} className="w-20 h-20 rounded-full mx-auto" />
      <h3 className="mt-2 text-center font-bold">{user.name}</h3>
      <p className="text-center text-sm text-gray-600">{user.email}</p>
    </div>
  );
};

export default UserCard;