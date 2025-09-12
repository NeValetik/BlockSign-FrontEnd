import { FC } from 'react';

const ProfileDocumentsPage: FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage your documents and signatures
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Documents</h3>
        <div className="text-center py-12">
          <p className="text-gray-500">No documents found</p>
          <p className="text-sm text-gray-400 mt-1">
            Your uploaded and signed documents will appear here
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDocumentsPage;
