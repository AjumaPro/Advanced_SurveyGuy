import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { InlineSpinner, CardSkeleton } from './LoadingSpinner';
import { trackNetworkRequest, debounce } from '../utils/performance';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

// Lazy load heavy components
const PackageEditor = React.lazy(() => import('./PackageEditor'));
const PackageAnalytics = React.lazy(() => import('./PackageAnalytics'));

const AdminPackagesCore = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Check admin permissions
  useEffect(() => {
    if (userProfile && !['admin', 'super_admin'].includes(userProfile.role)) {
      navigate('/app/dashboard');
      toast.error('Access denied. Admin privileges required.');
    }
  }, [userProfile, navigate]);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((term) => setSearchTerm(term), 300),
    []
  );

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => {
      const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || pkg.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [packages, searchTerm, filterStatus]);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      await trackNetworkRequest('Load Packages', async () => {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPackages(data || []);
      });
    } catch (error) {
      console.error('Error loading packages:', error);
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const createPackage = () => {
    setEditingPackage(null);
    setShowEditor(true);
  };

  const editPackage = (pkg) => {
    setEditingPackage(pkg);
    setShowEditor(true);
  };

  const deletePackage = async (pkgId) => {
    if (!window.confirm('Are you sure you want to delete this package?')) {
      return;
    }

    try {
      await trackNetworkRequest('Delete Package', async () => {
        const { error } = await supabase
          .from('subscription_plans')
          .delete()
          .eq('id', pkgId);

        if (error) throw error;
      });

      setPackages(prev => prev.filter(p => p.id !== pkgId));
      toast.success('Package deleted successfully');
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    }
  };

  const togglePackageStatus = async (pkgId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      await trackNetworkRequest('Toggle Package Status', async () => {
        const { error } = await supabase
          .from('subscription_plans')
          .update({ status: newStatus })
          .eq('id', pkgId);

        if (error) throw error;
      });

      setPackages(prev => prev.map(p => 
        p.id === pkgId ? { ...p, status: newStatus } : p
      ));
      
      toast.success(`Package ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating package status:', error);
      toast.error('Failed to update package status');
    }
  };

  const handleSavePackage = (packageData) => {
    if (editingPackage) {
      setPackages(prev => prev.map(p => 
        p.id === editingPackage.id ? { ...p, ...packageData } : p
      ));
    } else {
      setPackages(prev => [...prev, { ...packageData, id: Date.now() }]);
    }
    setShowEditor(false);
    setEditingPackage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <CardSkeleton count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="w-8 h-8 mr-3 text-blue-600" />
              Subscription Packages
            </h1>
            <p className="mt-2 text-gray-600">
              Manage subscription plans and pricing
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAnalytics(true)}
              className="btn-secondary"
            >
              <Eye className="w-4 h-4 mr-2" />
              Analytics
            </button>
            <button
              onClick={createPackage}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Package
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search packages..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{filteredPackages.length} packages</span>
              <button
                onClick={loadPackages}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {pkg.description || 'No description'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => togglePackageStatus(pkg.id, pkg.status)}
                      className={`p-1 rounded ${
                        pkg.status === 'active'
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {pkg.status === 'active' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Monthly Price</span>
                    <span className="font-medium text-gray-900">
                      ${pkg.monthly_price || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Annual Price</span>
                    <span className="font-medium text-gray-900">
                      ${pkg.annual_price || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Active Users</span>
                    <span className="font-medium text-gray-900">
                      {pkg.subscriber_count || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => editPackage(pkg)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePackage(pkg.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    pkg.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {pkg.status || 'inactive'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No packages found' : 'No packages yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first subscription package'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button onClick={createPackage} className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create First Package
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showEditor && (
        <Suspense fallback={<InlineSpinner />}>
          <PackageEditor
            package={editingPackage}
            onSave={handleSavePackage}
            onClose={() => {
              setShowEditor(false);
              setEditingPackage(null);
            }}
          />
        </Suspense>
      )}

      {showAnalytics && (
        <Suspense fallback={<InlineSpinner />}>
          <PackageAnalytics
            packages={packages}
            onClose={() => setShowAnalytics(false)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default AdminPackagesCore;
