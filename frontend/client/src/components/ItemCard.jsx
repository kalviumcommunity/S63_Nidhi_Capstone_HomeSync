import React from 'react';
import UserCard from './UserCard';

const ItemCard = ({ item }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-2xl shadow-md">
      <img src={item.image} alt={item.name} className="w-full h-auto max-h-60 object-cover rounded-xl" />
      <h2 className="mt-2 text-xl font-semibold">{item.name}</h2>
      <p className="text-sm text-gray-700">{item.description}</p>
      <p className="mt-1 font-medium text-green-600">${item.price}</p>
      <div className="mt-4">
        <UserCard user={item.user} />
      </div>
    </div>
  );
};

export default ItemCard;