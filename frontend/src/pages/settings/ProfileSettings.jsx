import React from 'react';

const ProfileSettings = () => {
  return (
    <div className="min-h-screen md:w-[65vw] w-[95vw] bg-gray-900 p-4 md:p-8 text-gray-200 overflow-y-auto scrollbar-hide mx-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold mb-8 text-white text-center">My Profile</h1>

        {/* Profile Image Section */}
        <div className="flex flex-col md:flex-row items-center justify-center mb-8 space-y-4 md:space-y-0">
          <div className="relative w-24 h-24 rounded-full overflow-hidden md:mr-6 border-2 border-gray-600">
            <img
              src="https://ik.imagekit.io/fbb6rjjzu/social-media-images/2cedfbeb-0cfe-4a13-bcf9-d71de0397e2b_kD7Zlq9GM?updatedAt=1758531248955"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-center">
            <button className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Change Image
            </button>
            <button className="w-full md:w-auto px-4 py-2 border border-gray-600 text-gray-200 rounded-md hover:bg-gray-800 transition-colors">
              Remove Image
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-8 text-center">
          We support PNGs, JPEGs and GIFs under 2MB
        </p>

      {/* Name Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
            value="Brian"
            readOnly
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
            value="Frederin"
            readOnly
          />
        </div>
      </div>

      {/* Account Security Section */}
      <h2 className="text-2xl font-semibold mb-6 text-white">Account Security</h2>

      <div className="space-y-6 mb-10">
        {/* Email */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          <div className="w-full md:flex-grow md:mr-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
              value="brianfrederin@email.com"
              readOnly
            />
          </div>
          <button className="w-full md:w-auto px-4 py-2 border border-gray-600 text-gray-200 rounded-md hover:bg-gray-800 transition-colors">
            Change email
          </button>
        </div>

        {/* Password */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          <div className="w-full md:flex-grow md:mr-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
              value="********"
              readOnly
            />
          </div>
          <button className="w-full md:w-auto px-4 py-2 border border-gray-600 text-gray-200 rounded-md hover:bg-gray-800 transition-colors">
            Change password
          </button>
        </div>

        {/* 2-Step Verifications */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          <div>
            <h3 className="text-base font-medium text-gray-100">
              2-Step Verifications
            </h3>
            <p className="text-sm text-gray-400">
              Add an additional layer of security to your account during login.
            </p>
          </div>
          {/* Toggle Switch */}
          <label htmlFor="twoStepVerification" className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="twoStepVerification" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Support Access Section */}
      <h2 className="text-2xl font-semibold mb-6 text-white">Support Access</h2>

      <div className="space-y-6 mb-10">
        {/* Support access */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          <div>
            <h3 className="text-base font-medium text-gray-100">
              Support access
            </h3>
            <p className="text-sm text-gray-400">
              You have granted us to access to your account for support purposes until Aug 31, 2023, 9:40 PM.
            </p>
          </div>
          {/* Toggle Switch */}
          <label htmlFor="supportAccess" className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="supportAccess" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Log out of all devices */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          <div>
            <h3 className="text-base font-medium text-gray-100">
              Log out of all devices
            </h3>
            <p className="text-sm text-gray-400">
              Log out of all other active sessions on other devices besides this one.
            </p>
          </div>
          <button className="w-full md:w-auto px-4 py-2 border border-gray-600 text-gray-200 rounded-md hover:bg-gray-800 transition-colors">
            Log out
          </button>
        </div>

        {/* Delete my account */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          <div>
            <h3 className="text-base font-medium text-red-500">
              Delete my account
            </h3>
            <p className="text-sm text-gray-400">
              Permanently delete the account and remove access from all workspaces.
            </p>
          </div>
          <button className="w-full md:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProfileSettings;
