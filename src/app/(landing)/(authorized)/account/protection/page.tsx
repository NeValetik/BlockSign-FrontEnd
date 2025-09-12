import { FC } from 'react';

const ProfileSettingsPage: FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage your account preferences and security settings
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Account Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox" defaultChecked />
                  <span className="ml-2 text-sm text-gray-600">Document signing notifications</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                <option>English</option>
                <option>Romanian</option>
                <option>Russian</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
          <div className="space-y-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Change Password
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
              Enable Two-Factor Authentication
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
