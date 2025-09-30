import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Shield, User, Crown, Settings } from 'lucide-react';

const AdminRoleChecker = () => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  // Only allow super admin (infoajumapro@gmail.com) to change roles
  const isSuperAdmin = user?.email === 'infoajumapro@gmail.com' || userProfile?.role === 'super_admin';

  const updateUserRole = async (newRole) => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log(`🔧 Updating user ${user.email} to role: ${newRole}`);
      
      // First, check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Create profile if it doesn't exist
        console.log('📝 Creating new profile...');
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            role: newRole,
            is_active: true,
            is_verified: true
          })
          .select()
          .single();

        if (error) {
          console.error('❌ Error creating profile:', error);
          toast.error(`Failed to create profile: ${error.message}`);
          return;
        }
        
        console.log('✅ Profile created:', data);
        toast.success(`Profile created with ${newRole} role!`);
      } else {
        // Update existing profile
        console.log('📝 Updating existing profile...');
        const { data, error } = await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', user.id)
          .select()
          .single();

        if (error) {
          console.error('❌ Error updating role:', error);
          toast.error(`Failed to update role: ${error.message}`);
          return;
        }
        
        console.log('✅ Role updated:', data);
        toast.success(`Role updated to ${newRole}!`);
      }

      // Refresh the page to reload the profile
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('❌ Error in role update:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Please log in to check admin status</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2" />
        Admin Role Manager
      </h3>
      
      <div className="space-y-4">
        {/* Current Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Current Status:</h4>
          <div className="space-y-2">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Profile Role:</strong> {userProfile?.role || 'Loading...'}</p>
            <p><strong>Is Active:</strong> {userProfile?.is_active ? 'Yes' : 'No'}</p>
            <p><strong>Is Verified:</strong> {userProfile?.is_verified ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Role Actions */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Role Management:</h4>
          
          {isSuperAdmin ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => updateUserRole('user')}
                disabled={loading}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <User className="w-4 h-4" />
                <span>Set as User</span>
              </button>

              <button
                onClick={() => updateUserRole('admin')}
                disabled={loading}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Shield className="w-4 h-4" />
                <span>Set as Admin</span>
              </button>

              <button
                onClick={() => updateUserRole('super_admin')}
                disabled={loading}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Crown className="w-4 h-4" />
                <span>Set as Super Admin</span>
              </button>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Restricted Access</span>
              </div>
              <p className="text-yellow-700 text-sm">
                Only the super administrator (infoajumapro@gmail.com) can modify user roles.
              </p>
              {user?.email === 'infoajumapro@gmail.com' && (
                <p className="text-blue-600 text-sm mt-2">
                  Your super admin privileges may not be loaded yet. Please refresh the page.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Click "Set as Admin" to give yourself admin privileges</li>
            <li>The page will refresh automatically after the update</li>
            <li>The Administration section should appear in the sidebar</li>
            <li>You can then access admin features like user management</li>
          </ol>
        </div>

        {/* Debug Info */}
        <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <summary className="cursor-pointer font-medium text-gray-900">
            Debug Information
          </summary>
          <pre className="mt-2 text-xs text-gray-600 overflow-auto">
            {JSON.stringify({
              user: {
                id: user.id,
                email: user.email,
                role: user.role
              },
              userProfile,
              timestamp: new Date().toISOString()
            }, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default AdminRoleChecker;
