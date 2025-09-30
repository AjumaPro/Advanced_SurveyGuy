import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const DatabaseInspector = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);
  const [tableStructure, setTableStructure] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Check what tables exist in the database
  const inspectDatabase = async () => {
    setLoading(true);
    setError('');

    try {
      // Get list of tables in the public schema
      const { data: tablesData, error: tablesError } = await supabase
        .rpc('get_schema_tables');

      if (tablesError) {
        // Fallback: Try to query known tables
        const knownTables = [
          'profiles', 'surveys', 'survey_responses', 'templates', 
          'events', 'event_registrations', 'notifications', 'analytics'
        ];
        
        const existingTables = [];
        
        for (const tableName of knownTables) {
          try {
            const { error } = await supabase
              .from(tableName)
              .select('*')
              .limit(1);
            
            if (!error) {
              existingTables.push({ table_name: tableName });
            }
          } catch (e) {
            // Table doesn't exist or no access
          }
        }
        
        setTables(existingTables);
      } else {
        setTables(tablesData || []);
      }

    } catch (err) {
      setError(`Database inspection failed: ${err.message}`);
      toast.error('Failed to inspect database');
    } finally {
      setLoading(false);
    }
  };

  // Get table structure and sample data
  const inspectTable = async (tableName) => {
    if (!tableName) return;
    
    setLoading(true);
    setSelectedTable(tableName);
    setTableData([]);
    setTableStructure([]);

    try {
      // Get sample data (first 10 rows)
      const { data: sampleData, error: dataError } = await supabase
        .from(tableName)
        .select('*')
        .limit(10);

      if (dataError) {
        setError(`Cannot access table ${tableName}: ${dataError.message}`);
      } else {
        setTableData(sampleData || []);
        
        // Extract column structure from sample data
        if (sampleData && sampleData.length > 0) {
          const columns = Object.keys(sampleData[0]).map(key => ({
            name: key,
            type: typeof sampleData[0][key],
            sample: sampleData[0][key]
          }));
          setTableStructure(columns);
        }
      }

      // Get RLS policies for this table
      const { data: policiesData, error: policiesError } = await supabase
        .rpc('get_table_policies', { table_name: tableName });

      if (!policiesError && policiesData) {
        setPolicies(policiesData);
      }

    } catch (err) {
      setError(`Failed to inspect table ${tableName}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Create missing tables
  const createMissingTables = async () => {
    setLoading(true);
    try {
      // This would execute our complete setup script
      toast.info('To create missing tables, run the complete-supabase-setup.sql script in your Supabase SQL Editor');
      
      // You could also implement individual table creation here
      
    } catch (err) {
      setError(`Failed to create tables: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    inspectDatabase();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-center mb-6">Database Inspector</h1>
          
          {/* Current Status */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Connection Status</h3>
            <p className="text-blue-700">
              User: {user ? `${user.email} (Connected)` : 'Not connected'}
            </p>
            <p className="text-blue-700">
              Tables Found: {tables.length}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mb-6 flex flex-wrap gap-4">
            <button
              onClick={inspectDatabase}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Inspecting...' : 'Refresh Database Info'}
            </button>
            
            <button
              onClick={createMissingTables}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Create Missing Tables
            </button>
          </div>

          {/* Tables List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Tables List */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Database Tables ({tables.length})</h3>
              
              {tables.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-700">No tables found or no access to database.</p>
                  <p className="text-yellow-600 text-sm mt-2">
                    You may need to run the setup script first.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tables.map((table, index) => (
                    <button
                      key={index}
                      onClick={() => inspectTable(table.table_name)}
                      className={`w-full text-left p-3 border rounded-lg transition-colors ${
                        selectedTable === table.table_name
                          ? 'bg-blue-50 border-blue-200 text-blue-800'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{table.table_name}</div>
                      <div className="text-sm text-gray-600">
                        Click to inspect structure and data
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Required Tables Checklist */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Required Tables Checklist:</h4>
                {[
                  'profiles', 'surveys', 'survey_responses', 'templates',
                  'events', 'event_registrations', 'notifications', 'analytics'
                ].map(requiredTable => {
                  const exists = tables.some(t => t.table_name === requiredTable);
                  return (
                    <div key={requiredTable} className="flex items-center mb-2">
                      <span className={`mr-2 ${exists ? 'text-green-600' : 'text-red-600'}`}>
                        {exists ? '✅' : '❌'}
                      </span>
                      <span className={exists ? 'text-green-800' : 'text-red-800'}>
                        {requiredTable}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Table Details */}
            <div>
              {selectedTable ? (
                <>
                  <h3 className="text-xl font-semibold mb-4">
                    Table: {selectedTable}
                  </h3>

                  {/* Table Structure */}
                  {tableStructure.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Column Structure:</h4>
                      <div className="bg-gray-50 border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-200">
                            <tr>
                              <th className="px-3 py-2 text-left">Column</th>
                              <th className="px-3 py-2 text-left">Type</th>
                              <th className="px-3 py-2 text-left">Sample</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableStructure.map((col, index) => (
                              <tr key={index} className="border-t">
                                <td className="px-3 py-2 font-medium">{col.name}</td>
                                <td className="px-3 py-2 text-gray-600">{col.type}</td>
                                <td className="px-3 py-2 text-gray-600 truncate max-w-32">
                                  {JSON.stringify(col.sample)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Sample Data */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">
                      Sample Data ({tableData.length} rows):
                    </h4>
                    
                    {tableData.length === 0 ? (
                      <div className="p-4 bg-gray-50 border rounded-lg text-gray-600">
                        No data found in this table
                      </div>
                    ) : (
                      <div className="bg-gray-50 border rounded-lg p-4 overflow-x-auto">
                        <pre className="text-xs">
                          {JSON.stringify(tableData, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* RLS Policies */}
                  {policies.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">RLS Policies:</h4>
                      <div className="space-y-2">
                        {policies.map((policy, index) => (
                          <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="font-medium text-green-800">{policy.policyname}</div>
                            <div className="text-sm text-green-600">{policy.cmd}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Select a table from the left to inspect its structure and data
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Check which tables exist in your current database</li>
              <li>2. If tables are missing, run the complete-supabase-setup.sql script</li>
              <li>3. Verify RLS policies are in place</li>
              <li>4. Test authentication and data access</li>
            </ol>
          </div>

          {/* Quick Links */}
          <div className="mt-6 text-center space-x-4">
            <a href="/supabase-test" className="text-blue-600 hover:text-blue-800 underline">
              Connection Test
            </a>
            <a href="/login-test" className="text-blue-600 hover:text-blue-800 underline">
              Login Test
            </a>
            <a href="/" className="text-blue-600 hover:text-blue-800 underline">
              Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseInspector;
