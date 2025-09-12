import { FC } from 'react';

const ProfilePage: FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage your personal information and account details
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input 
              type="text" 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input 
              type="text" 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter your last name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input 
              type="tel" 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter your phone number"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;