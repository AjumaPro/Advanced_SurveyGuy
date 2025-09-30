/**
 * API Documentation Component
 * Interactive API documentation with examples and testing
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Copy,
  Play,
  ChevronDown,
  ChevronRight,
  Globe,
  Lock,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  ExternalLink,
  Book,
  Zap,
  Server,
  Database,
  Key,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const APIDocumentation = ({ onClose }) => {
  const { user } = useAuth();
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Base API configuration
  const baseUrl = 'https://api.surveyguy.com/v1';
  
  // API Documentation Data
  const apiDocs = {
    baseUrl,
    authentication: {
      type: 'API Key',
      header: 'X-API-Key',
      description: 'Include your API key in the request header'
    },
    endpoints: {
      surveys: [
        {
          method: 'GET',
          path: '/surveys',
          title: 'List Surveys',
          description: 'Retrieve a list of all surveys for the authenticated user',
          parameters: {
            query: [
              { name: 'page', type: 'integer', required: false, description: 'Page number for pagination' },
              { name: 'limit', type: 'integer', required: false, description: 'Number of items per page (max 100)' },
              { name: 'status', type: 'string', required: false, description: 'Filter by status (draft, published)' }
            ]
          },
          responses: {
            200: {
              description: 'Success',
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/definitions/Survey' }
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer' },
                      limit: { type: 'integer' },
                      total: { type: 'integer' },
                      pages: { type: 'integer' }
                    }
                  }
                }
              }
            },
            401: { description: 'Unauthorized - Invalid API key' },
            403: { description: 'Forbidden - Insufficient permissions' }
          },
          examples: {
            curl: `curl -H "X-API-Key: your-api-key" \\
  "${baseUrl}/surveys?page=1&limit=10"`,
            javascript: `const response = await fetch('${baseUrl}/surveys?page=1&limit=10', {
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();`,
            python: `import requests

headers = {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
}

response = requests.get('${baseUrl}/surveys?page=1&limit=10', headers=headers)
data = response.json()`
          }
        },
        {
          method: 'POST',
          path: '/surveys',
          title: 'Create Survey',
          description: 'Create a new survey',
          parameters: {
            body: {
              type: 'object',
              required: ['title'],
              properties: {
                title: { type: 'string', description: 'Survey title' },
                description: { type: 'string', description: 'Survey description' },
                questions: {
                  type: 'array',
                  items: { $ref: '#/definitions/Question' }
                },
                settings: { type: 'object', description: 'Survey settings' }
              }
            }
          },
          responses: {
            201: { description: 'Created', schema: { $ref: '#/definitions/Survey' } },
            400: { description: 'Bad Request - Invalid data' },
            401: { description: 'Unauthorized' }
          },
          examples: {
            curl: `curl -X POST -H "X-API-Key: your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Customer Satisfaction Survey", "description": "Help us improve our service"}' \\
  "${baseUrl}/surveys"`,
            javascript: `const response = await fetch('${baseUrl}/surveys', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Customer Satisfaction Survey',
    description: 'Help us improve our service'
  })
});
const survey = await response.json();`
          }
        },
        {
          method: 'GET',
          path: '/surveys/{id}',
          title: 'Get Survey',
          description: 'Retrieve a specific survey by ID',
          parameters: {
            path: [
              { name: 'id', type: 'string', required: true, description: 'Survey ID' }
            ]
          },
          responses: {
            200: { description: 'Success', schema: { $ref: '#/definitions/Survey' } },
            404: { description: 'Survey not found' }
          }
        },
        {
          method: 'PUT',
          path: '/surveys/{id}',
          title: 'Update Survey',
          description: 'Update an existing survey',
          parameters: {
            path: [
              { name: 'id', type: 'string', required: true, description: 'Survey ID' }
            ],
            body: { type: 'object' }
          }
        },
        {
          method: 'DELETE',
          path: '/surveys/{id}',
          title: 'Delete Survey',
          description: 'Delete a survey',
          parameters: {
            path: [
              { name: 'id', type: 'string', required: true, description: 'Survey ID' }
            ]
          }
        }
      ],
      responses: [
        {
          method: 'GET',
          path: '/surveys/{id}/responses',
          title: 'Get Survey Responses',
          description: 'Retrieve all responses for a specific survey',
          parameters: {
            path: [
              { name: 'id', type: 'string', required: true, description: 'Survey ID' }
            ],
            query: [
              { name: 'page', type: 'integer', required: false },
              { name: 'limit', type: 'integer', required: false }
            ]
          }
        },
        {
          method: 'POST',
          path: '/responses',
          title: 'Submit Response',
          description: 'Submit a response to a survey',
          parameters: {
            body: {
              type: 'object',
              required: ['survey_id', 'responses'],
              properties: {
                survey_id: { type: 'string' },
                responses: { type: 'object' }
              }
            }
          }
        }
      ],
      analytics: [
        {
          method: 'GET',
          path: '/analytics/{survey_id}',
          title: 'Get Survey Analytics',
          description: 'Get analytics data for a specific survey',
          parameters: {
            path: [
              { name: 'survey_id', type: 'string', required: true }
            ],
            query: [
              { name: 'timeframe', type: 'string', required: false, description: '7d, 30d, 90d' }
            ]
          }
        }
      ],
      webhooks: [
        {
          method: 'GET',
          path: '/webhooks',
          title: 'List Webhooks',
          description: 'Retrieve all webhooks for the authenticated user'
        },
        {
          method: 'POST',
          path: '/webhooks',
          title: 'Create Webhook',
          description: 'Create a new webhook',
          parameters: {
            body: {
              type: 'object',
              required: ['url', 'events'],
              properties: {
                url: { type: 'string' },
                events: { type: 'array' },
                secret: { type: 'string' }
              }
            }
          }
        }
      ]
    },
    schemas: {
      Survey: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['draft', 'published'] },
          questions: { type: 'array' },
          settings: { type: 'object' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      Question: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['text', 'multiple_choice', 'rating', 'email'] },
          title: { type: 'string' },
          required: { type: 'boolean' },
          options: { type: 'array' }
        }
      },
      Response: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          survey_id: { type: 'string' },
          responses: { type: 'object' },
          submitted_at: { type: 'string', format: 'date-time' }
        }
      }
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const testEndpoint = async (endpoint) => {
    if (!apiKey) {
      toast.error('Please enter your API key to test endpoints');
      return;
    }

    setLoading(true);
    try {
      const url = `${baseUrl}${endpoint.path}`;
      const options = {
        method: endpoint.method,
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      };

      // Add sample data for POST requests
      if (endpoint.method === 'POST') {
        options.body = JSON.stringify({
          title: 'Test Survey',
          description: 'Test survey created via API'
        });
      }

      const response = await fetch(url, options);
      const data = await response.json();

      setTestResults(prev => ({
        ...prev,
        [endpoint.path]: {
          status: response.status,
          statusText: response.statusText,
          data,
          timestamp: new Date().toISOString()
        }
      }));

      if (response.ok) {
        toast.success('API test successful!');
      } else {
        toast.error(`API test failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('API test error:', error);
      setTestResults(prev => ({
        ...prev,
        [endpoint.path]: {
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
      toast.error('API test failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderEndpoint = (endpoint, category) => (
    <div key={`${category}-${endpoint.path}`} className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMethodColor(endpoint.method)}`}>
            {endpoint.method}
          </span>
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{endpoint.path}</code>
        </div>
        <button
          onClick={() => testEndpoint(endpoint)}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors text-sm"
        >
          <Play className="w-3 h-3" />
          Test
        </button>
      </div>

      <h4 className="font-semibold text-gray-900 mb-2">{endpoint.title}</h4>
      <p className="text-gray-600 text-sm mb-4">{endpoint.description}</p>

      {/* Parameters */}
      {endpoint.parameters && (
        <div className="mb-4">
          <h5 className="font-medium text-gray-900 mb-2">Parameters</h5>
          {endpoint.parameters.query && (
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">Query Parameters:</span>
              <div className="mt-1 space-y-1">
                {endpoint.parameters.query.map((param, index) => (
                  <div key={index} className="text-sm">
                    <code className="bg-gray-100 px-1 rounded">{param.name}</code>
                    <span className="text-gray-600"> ({param.type})</span>
                    {param.required && <span className="text-red-500 ml-1">*</span>}
                    <span className="text-gray-500 ml-2">{param.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {endpoint.parameters.path && (
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">Path Parameters:</span>
              <div className="mt-1 space-y-1">
                {endpoint.parameters.path.map((param, index) => (
                  <div key={index} className="text-sm">
                    <code className="bg-gray-100 px-1 rounded">{param.name}</code>
                    <span className="text-gray-600"> ({param.type})</span>
                    {param.required && <span className="text-red-500 ml-1">*</span>}
                    <span className="text-gray-500 ml-2">{param.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Examples */}
      {endpoint.examples && (
        <div className="mb-4">
          <h5 className="font-medium text-gray-900 mb-2">Examples</h5>
          {Object.entries(endpoint.examples).map(([language, code]) => (
            <div key={language} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 capitalize">{language}</span>
                <button
                  onClick={() => copyToClipboard(code)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                <code>{code}</code>
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* Test Results */}
      {testResults[endpoint.path] && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <div className="flex items-center gap-2 mb-2">
            {testResults[endpoint.path].error ? (
              <XCircle className="w-4 h-4 text-red-500" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            <span className="font-medium text-gray-900">Test Result</span>
            <span className="text-sm text-gray-500">
              {new Date(testResults[endpoint.path].timestamp).toLocaleTimeString()}
            </span>
          </div>
          
          {testResults[endpoint.path].error ? (
            <p className="text-red-600 text-sm">{testResults[endpoint.path].error}</p>
          ) : (
            <div>
              <p className="text-sm mb-2">
                Status: <span className="font-mono">{testResults[endpoint.path].status} {testResults[endpoint.path].statusText}</span>
              </p>
              <pre className="bg-white p-2 rounded text-xs overflow-x-auto max-h-40">
                {JSON.stringify(testResults[endpoint.path].data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Book className="w-6 h-6 text-blue-500" />
                API Documentation
              </h2>
              <p className="text-gray-600 mt-1">Interactive API documentation with live testing</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              {/* API Key Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your API Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk_live_..."
                    className="flex-1 p-2 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(apiKey)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {Object.entries(apiDocs.endpoints).map(([category, endpoints]) => (
                  <div key={category}>
                    <button
                      onClick={() => toggleSection(category)}
                      className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded"
                    >
                      <span className="font-medium text-gray-900 capitalize">{category}</span>
                      {expandedSections[category] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    
                    {expandedSections[category] && (
                      <div className="ml-4 space-y-1">
                        {endpoints.map((endpoint, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedEndpoint(endpoint)}
                            className={`w-full text-left p-2 text-sm rounded ${
                              selectedEndpoint?.path === endpoint.path
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`px-1 py-0.5 text-xs rounded ${getMethodColor(endpoint.method)}`}>
                                {endpoint.method}
                              </span>
                              <span className="truncate">{endpoint.title}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {selectedEndpoint ? (
                renderEndpoint(selectedEndpoint, 'selected')
              ) : (
                <div className="text-center py-12">
                  <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Endpoint</h3>
                  <p className="text-gray-600">Choose an endpoint from the sidebar to view its documentation and test it.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Server className="w-4 h-4" />
                <span>Base URL: {baseUrl}</span>
              </div>
              <div className="flex items-center gap-1">
                <Key className="w-4 h-4" />
                <span>Auth: {apiDocs.authentication.type}</span>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(baseUrl)}
              className="flex items-center gap-2 px-3 py-1 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors text-sm"
            >
              <Copy className="w-3 h-3" />
              Copy Base URL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentation;
