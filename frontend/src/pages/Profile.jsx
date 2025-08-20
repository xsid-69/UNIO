import React from 'react';

const Profile = () => {
  return (
    <>
      <div className="relative w-full h-[20vh]  my-8">
        <img
          src="https://i.pinimg.com/736x/ee/63/79/ee63793a7276d8682064080a725953c4.jpg" // Placeholder image
          alt="Profile"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25vh] h-[25vh] rounded-full border-4 border-white object-cover"
        />
      </div>
      <h2 className="text-xl font-bold mb-1">Siddhant Wankhade</h2>
      <p className="text-gray-400 text-sm flex items-center gap-1 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        Nagpur, India
      </p>

      <div className="flex justify-around w-full mb-6">
        <div className="text-center">
          <p className="font-bold text-lg">69</p>
          <p className="text-gray-400 text-sm">Posts</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-lg">69.69M</p>
          <p className="text-gray-400 text-sm">Followers</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-lg">69</p>
          <p className="text-gray-400 text-sm">Following</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 w-full">
        <button className="flex-1 bg-[#13c4a3] text-white py-2 rounded-lg font-semibold">Follow</button>
        <button className="flex-1 border border-[#13c4a3] text-[#13c4a3] py-2 rounded-lg font-semibold">Message</button>
      </div>

      <p className="text-gray-400 text-sm text-center mb-6">
        A young, talented Engineer from Akola City. Glad to work with you at your Company and let's make it Crazzy!
      </p>
    </>
  );
};

export default Profile;
