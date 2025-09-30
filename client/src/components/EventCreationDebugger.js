import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const EventCreationDebugger = () => {
  const { user } = useAuth();
  const [debugResults, setDebugResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results = {};

    try {
      // Test 1: Check authentication
      console.log('🔍 Test 1: Checking authentication...');
      if (!user) {
        results.auth = { status: 'FAILED', message: 'User not authenticated' };
      } else {
        results.auth = { status: 'PASSED', message: `User authenticated: ${user.email}` };
      }

      // Test 2: Check database connection
      console.log('🔍 Test 2: Checking database connection...');
      const { data: connectionTest, error: connectionError } = await supabase
        .from('events')
        .select('count')
        .limit(1);
      
      if (connectionError) {
        results.connection = { status: 'FAILED', message: connectionError.message };
      } else {
        results.connection = { status: 'PASSED', message: 'Database connection successful' };
      }

      // Test 3: Check table schema
      console.log('🔍 Test 3: Checking table schema...');
      const { data: schemaTest, error: schemaError } = await supabase
        .from('events')
        .select('*')
        .limit(0);
      
      if (schemaError) {
        results.schema = { status: 'FAILED', message: schemaError.message };
      } else {
        results.schema = { status: 'PASSED', message: 'Table schema accessible' };
      }

      // Test 4: Check RLS policies
      console.log('🔍 Test 4: Checking RLS policies...');
      const testEventData = {
        user_id: user?.id || '00000000-0000-0000-0000-000000000000',
        title: 'Debug Test Event',
        description: 'Test event for debugging',
        event_type: 'standard',
        start_date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Test Location',
        capacity: 1,
        registration_required: true,
        is_public: false,
        status: 'draft',
        metadata: {}
      };

      const { data: insertTest, error: insertError } = await supabase
        .from('events')
        .insert(testEventData)
        .select()
        .single();

      if (insertError) {
        results.rls = { status: 'FAILED', message: insertError.message };
      } else {
        results.rls = { status: 'PASSED', message: 'RLS policies working' };
        
        // Clean up test event
        await supabase
          .from('events')
          .delete()
          .eq('id', insertTest.id);
      }

      // Test 5: Check field mapping
      console.log('🔍 Test 5: Checking field mapping...');
      const fieldMappingTest = {
        user_id: user?.id || '00000000-0000-0000-0000-000000000000',
        title: 'Field Mapping Test',
        description: 'Testing field mapping',
        event_type: 'standard',
        start_date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Test Location',
        capacity: 1,
        registration_required: true,
        is_public: false,
        status: 'draft',
        metadata: { test: true }
      };

      const { data: mappingTest, error: mappingError } = await supabase
        .from('events')
        .insert(fieldMappingTest)
        .select()
        .single();

      if (mappingError) {
        results.fieldMapping = { status: 'FAILED', message: mappingError.message };
      } else {
        results.fieldMapping = { status: 'PASSED', message: 'Field mapping successful' };
        
        // Clean up test event
        await supabase
          .from('events')
          .delete()
          .eq('id', mappingTest.id);
      }

      setDebugResults(results);
      toast.success('Diagnostics completed! Check results below.');

    } catch (error) {
      console.error('💥 Diagnostics failed:', error);
      results.general = { status: 'FAILED', message: error.message };
      setDebugResults(results);
      toast.error('Diagnostics failed with exception');
    } finally {
      setIsRunning(false);
    }
  };

  const createTestEvent = async () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    try {
      const testEvent = {
        user_id: user.id,
        title: `Debug Test Event - ${new Date().toISOString()}`,
        description: 'Test event created via debugger',
        event_type: 'standard',
        start_date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Debug Test Location',
        capacity: 10,
        registration_required: true,
        is_public: false,
        status: 'draft',
        metadata: { debug: true, created_at: new Date().toISOString() }
      };

      console.log('📝 Creating test event:', testEvent);

      const { data, error } = await supabase
        .from('events')
        .insert(testEvent)
        .select()
        .single();

      if (error) {
        console.error('❌ Test event creation failed:', error);
        toast.error(`Failed to create test event: ${error.message}`);
      } else {
        console.log('✅ Test event created successfully:', data);
        toast.success('Test event created successfully!');
      }
    } catch (error) {
      console.error('💥 Test event creation failed:', error);
      toast.error(`Test event creation failed: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Creation Debugger</h3>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunning ? 'Running Diagnostics...' : 'Run Diagnostics'}
          </button>
          
          <button
            onClick={createTestEvent}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Create Test Event
          </button>
        </div>

        {Object.keys(debugResults).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Diagnostic Results:</h4>
            {Object.entries(debugResults).map(([test, result]) => (
              <div key={test} className="p-3 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{test.replace(/([A-Z])/g, ' $1')}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    result.status === 'PASSED' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {result.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{result.message}</p>
              </div>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p><strong>User ID:</strong> {user?.id || 'Not authenticated'}</p>
          <p><strong>User Email:</strong> {user?.email || 'Not authenticated'}</p>
          <p><strong>Supabase URL:</strong> {process.env.REACT_APP_SUPABASE_URL || 'Not set'}</p>
        </div>
      </div>
    </div>
  );
};

export default EventCreationDebugger;

