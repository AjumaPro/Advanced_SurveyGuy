import React from 'react';

const EventDebugger = ({ event }) => {
  if (!event) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800 mb-2">Event Debugger</h3>
        <p className="text-red-700">No event data provided</p>
      </div>
    );
  }

  const generateTestUrl = () => {
    const baseUrl = window.location.origin;
    const eventUrl = `${baseUrl}/app/events/register/${event.id}`;
    return eventUrl;
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-medium text-blue-800 mb-4">Event Debugger</h3>
      
      <div className="space-y-3">
        <div>
          <strong className="text-blue-900">Event ID:</strong>
          <span className="ml-2 text-blue-700">{event.id || 'No ID'}</span>
        </div>
        
        <div>
          <strong className="text-blue-900">Event Title:</strong>
          <span className="ml-2 text-blue-700">{event.title || 'No Title'}</span>
        </div>
        
        <div>
          <strong className="text-blue-900">Event Status:</strong>
          <span className="ml-2 text-blue-700">{event.status || 'No Status'}</span>
        </div>
        
        <div>
          <strong className="text-blue-900">Is Public:</strong>
          <span className="ml-2 text-blue-700">{event.is_public ? 'Yes' : 'No'}</span>
        </div>
        
        <div>
          <strong className="text-blue-900">Start Date:</strong>
          <span className="ml-2 text-blue-700">{event.start_date || event.starts_at || event.date || 'No Date'}</span>
        </div>
        
        <div>
          <strong className="text-blue-900">Location:</strong>
          <span className="ml-2 text-blue-700">{event.location || 'No Location'}</span>
        </div>
        
        <div>
          <strong className="text-blue-900">Generated URL:</strong>
          <div className="mt-1 p-2 bg-white rounded border text-sm text-blue-700 break-all">
            {generateTestUrl()}
          </div>
        </div>
        
        <div>
          <strong className="text-blue-900">Window Origin:</strong>
          <span className="ml-2 text-blue-700">{window.location.origin}</span>
        </div>
        
        <div className="pt-2">
          <strong className="text-blue-900">Raw Event Data:</strong>
          <pre className="mt-1 p-2 bg-white rounded border text-xs text-blue-700 overflow-auto max-h-32">
            {JSON.stringify(event, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default EventDebugger;






