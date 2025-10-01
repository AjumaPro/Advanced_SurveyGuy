/**
 * SDK Service
 * Handles SDK generation and download for different programming languages
 */

import JSZip from 'jszip';

// =============================================
// SDK GENERATION AND DOWNLOAD
// =============================================

export const sdkService = {
  // Generate SDK for a specific language
  async generateSDK(language, apiKey, options = {}) {
    try {
      const sdkData = this.getSDKTemplate(language, apiKey, options);
      
      switch (language) {
        case 'javascript':
          return this.generateJavaScriptSDK(sdkData);
        case 'python':
          return this.generatePythonSDK(sdkData);
        case 'php':
          return this.generatePHPSDK(sdkData);
        case 'node':
          return this.generateNodeSDK(sdkData);
        case 'curl':
          return this.generateCurlExamples(sdkData);
        default:
          throw new Error(`Unsupported language: ${language}`);
      }
    } catch (error) {
      console.error('Error generating SDK:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Download SDK as ZIP file
  async downloadSDK(language, apiKey, options = {}) {
    try {
      const zip = new JSZip();
      
      // Add main SDK file
      const sdkData = this.getSDKTemplate(language, apiKey, options);
      const mainFile = this.generateMainSDKFile(language, sdkData);
      
      zip.file(`${this.getMainFileName(language)}`, mainFile);
      
      // Add additional files
      const additionalFiles = this.getAdditionalFiles(language, sdkData);
      additionalFiles.forEach(file => {
        zip.file(file.name, file.content);
      });
      
      // Add README
      const readme = this.generateReadme(language, sdkData);
      zip.file('README.md', readme);
      
      // Add example files
      const examples = this.generateExamples(language, sdkData);
      const examplesFolder = zip.folder('examples');
      examples.forEach(example => {
        examplesFolder.file(example.name, example.content);
      });
      
      // Generate and download ZIP
      const blob = await zip.generateAsync({ type: 'blob' });
      this.downloadBlob(blob, `surveyguy-${language}-sdk.zip`);
      
      return {
        success: true,
        filename: `surveyguy-${language}-sdk.zip`
      };
    } catch (error) {
      console.error('Error downloading SDK:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get SDK template data
  getSDKTemplate(language, apiKey, options) {
    return {
      language,
      apiKey,
      baseUrl: 'https://api.surveyguy.com/v1',
      packageName: options.packageName || 'surveyguy-sdk',
      version: options.version || '1.0.0',
      description: 'SurveyGuy API SDK',
      author: options.author || 'SurveyGuy',
      license: options.license || 'MIT',
      features: options.features || ['surveys', 'responses', 'analytics']
    };
  },

  // Generate JavaScript SDK
  generateJavaScriptSDK(data) {
    const jsContent = `/**
 * SurveyGuy JavaScript SDK
 * Version: ${data.version}
 * Generated: ${new Date().toISOString()}
 */

class SurveyGuySDK {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || '${data.baseUrl}';
    this.timeout = options.timeout || 30000;
  }

  async request(endpoint, options = {}) {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const config = {
      method: options.method || 'GET',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(\`API Error: \${response.status} \${response.statusText}\`);
    }

    return response.json();
  }

  // Survey methods
  async getSurveys(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(\`/surveys?\${queryString}\`);
  }

  async getSurvey(id) {
    return this.request(\`/surveys/\${id}\`);
  }

  async createSurvey(surveyData) {
    return this.request('/surveys', {
      method: 'POST',
      body: surveyData
    });
  }

  async updateSurvey(id, surveyData) {
    return this.request(\`/surveys/\${id}\`, {
      method: 'PUT',
      body: surveyData
    });
  }

  async deleteSurvey(id) {
    return this.request(\`/surveys/\${id}\`, {
      method: 'DELETE'
    });
  }

  // Response methods
  async getResponses(surveyId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(\`/surveys/\${surveyId}/responses?\${queryString}\`);
  }

  async submitResponse(responseData) {
    return this.request('/responses', {
      method: 'POST',
      body: responseData
    });
  }

  // Analytics methods
  async getAnalytics(surveyId, timeframe = '30d') {
    return this.request(\`/analytics/\${surveyId}?timeframe=\${timeframe}\`);
  }

  // Webhook methods
  async getWebhooks() {
    return this.request('/webhooks');
  }

  async createWebhook(webhookData) {
    return this.request('/webhooks', {
      method: 'POST',
      body: webhookData
    });
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SurveyGuySDK;
} else if (typeof define === 'function' && define.amd) {
  define([], () => SurveyGuySDK);
} else if (typeof window !== 'undefined') {
  window.SurveyGuySDK = SurveyGuySDK;
}

export default SurveyGuySDK;`;

    return {
      success: true,
      content: jsContent,
      filename: 'surveyguy.js'
    };
  },

  // Generate Python SDK
  generatePythonSDK(data) {
    const pythonContent = `"""
SurveyGuy Python SDK
Version: ${data.version}
Generated: ${new Date().toISOString()}
"""

import requests
import json
from typing import Dict, List, Optional, Any


class SurveyGuySDK:
    def __init__(self, api_key: str, base_url: str = '${data.baseUrl}', timeout: int = 30):
        self.api_key = api_key
        self.base_url = base_url
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            'X-API-Key': api_key,
            'Content-Type': 'application/json'
        })

    def _request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        kwargs.setdefault('timeout', self.timeout)
        
        response = self.session.request(method, url, **kwargs)
        response.raise_for_status()
        return response.json()

    # Survey methods
    def get_surveys(self, **params) -> Dict[str, Any]:
        """Get all surveys"""
        return self._request('GET', '/surveys', params=params)

    def get_survey(self, survey_id: str) -> Dict[str, Any]:
        """Get a specific survey"""
        return self._request('GET', f'/surveys/{survey_id}')

    def create_survey(self, survey_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new survey"""
        return self._request('POST', '/surveys', json=survey_data)

    def update_survey(self, survey_id: str, survey_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing survey"""
        return self._request('PUT', f'/surveys/{survey_id}', json=survey_data)

    def delete_survey(self, survey_id: str) -> None:
        """Delete a survey"""
        self._request('DELETE', f'/surveys/{survey_id}')

    # Response methods
    def get_responses(self, survey_id: str, **params) -> Dict[str, Any]:
        """Get responses for a survey"""
        return self._request('GET', f'/surveys/{survey_id}/responses', params=params)

    def submit_response(self, response_data: Dict[str, Any]) -> Dict[str, Any]:
        """Submit a response to a survey"""
        return self._request('POST', '/responses', json=response_data)

    # Analytics methods
    def get_analytics(self, survey_id: str, timeframe: str = '30d') -> Dict[str, Any]:
        """Get analytics for a survey"""
        return self._request('GET', f'/analytics/{survey_id}', params={'timeframe': timeframe})

    # Webhook methods
    def get_webhooks(self) -> List[Dict[str, Any]]:
        """Get all webhooks"""
        return self._request('GET', '/webhooks')

    def create_webhook(self, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new webhook"""
        return self._request('POST', '/webhooks', json=webhook_data)


# Example usage
if __name__ == "__main__":
    # Initialize SDK
    sdk = SurveyGuySDK('${data.apiKey}')
    
    # Example: Get all surveys
    try:
        surveys = sdk.get_surveys()
        print(f"Found {len(surveys.get('data', []))} surveys")
    except Exception as e:
        print(f"Error: {e}")`;

    return {
      success: true,
      content: pythonContent,
      filename: 'surveyguy.py'
    };
  },

  // Generate PHP SDK
  generatePHPSDK(data) {
    const phpContent = `<?php
/**
 * SurveyGuy PHP SDK
 * Version: ${data.version}
 * Generated: ${new Date().toISOString()}
 */

namespace SurveyGuy;

class SurveyGuySDK
{
    private $apiKey;
    private $baseUrl;
    private $timeout;

    public function __construct($apiKey, $baseUrl = '${data.baseUrl}', $timeout = 30)
    {
        $this->apiKey = $apiKey;
        $this->baseUrl = $baseUrl;
        $this->timeout = $timeout;
    }

    private function request($method, $endpoint, $data = null)
    {
        $url = $this->baseUrl . $endpoint;
        
        $headers = [
            'X-API-Key: ' . $this->apiKey,
            'Content-Type: application/json'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, $this->timeout);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new Exception("CURL Error: " . $error);
        }

        if ($httpCode >= 400) {
            throw new Exception("API Error: " . $httpCode . " " . $response);
        }

        return json_decode($response, true);
    }

    // Survey methods
    public function getSurveys($params = [])
    {
        $queryString = http_build_query($params);
        return $this->request('GET', '/surveys?' . $queryString);
    }

    public function getSurvey($id)
    {
        return $this->request('GET', '/surveys/' . $id);
    }

    public function createSurvey($surveyData)
    {
        return $this->request('POST', '/surveys', $surveyData);
    }

    public function updateSurvey($id, $surveyData)
    {
        return $this->request('PUT', '/surveys/' . $id, $surveyData);
    }

    public function deleteSurvey($id)
    {
        return $this->request('DELETE', '/surveys/' . $id);
    }

    // Response methods
    public function getResponses($surveyId, $params = [])
    {
        $queryString = http_build_query($params);
        return $this->request('GET', '/surveys/' . $surveyId . '/responses?' . $queryString);
    }

    public function submitResponse($responseData)
    {
        return $this->request('POST', '/responses', $responseData);
    }

    // Analytics methods
    public function getAnalytics($surveyId, $timeframe = '30d')
    {
        return $this->request('GET', '/analytics/' . $surveyId . '?timeframe=' . $timeframe);
    }

    // Webhook methods
    public function getWebhooks()
    {
        return $this->request('GET', '/webhooks');
    }

    public function createWebhook($webhookData)
    {
        return $this->request('POST', '/webhooks', $webhookData);
    }
}`;

    return {
      success: true,
      content: phpContent,
      filename: 'SurveyGuySDK.php'
    };
  },

  // Generate Node.js SDK
  generateNodeSDK(data) {
    const nodeContent = `/**
 * SurveyGuy Node.js SDK
 * Version: ${data.version}
 * Generated: ${new Date().toISOString()}
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

class SurveyGuySDK {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || '${data.baseUrl}';
    this.timeout = options.timeout || 30000;
  }

  async request(endpoint, options = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(this.baseUrl + endpoint);
      const method = options.method || 'GET';
      
      const requestOptions = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
          ...options.headers
        },
        timeout: this.timeout
      };

      let data = '';
      const req = (url.protocol === 'https:' ? https : http).request(requestOptions, (res) => {
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            if (res.statusCode >= 400) {
              reject(new Error(\`API Error: \${res.statusCode} \${res.statusMessage}\`));
            } else {
              resolve(jsonData);
            }
          } catch (error) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (options.body) {
        req.write(JSON.stringify(options.body));
      }

      req.end();
    });
  }

  // Survey methods
  async getSurveys(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(\`/surveys?\${queryString}\`);
  }

  async getSurvey(id) {
    return this.request(\`/surveys/\${id}\`);
  }

  async createSurvey(surveyData) {
    return this.request('/surveys', {
      method: 'POST',
      body: surveyData
    });
  }

  async updateSurvey(id, surveyData) {
    return this.request(\`/surveys/\${id}\`, {
      method: 'PUT',
      body: surveyData
    });
  }

  async deleteSurvey(id) {
    return this.request(\`/surveys/\${id}\`, {
      method: 'DELETE'
    });
  }

  // Response methods
  async getResponses(surveyId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(\`/surveys/\${surveyId}/responses?\${queryString}\`);
  }

  async submitResponse(responseData) {
    return this.request('/responses', {
      method: 'POST',
      body: responseData
    });
  }

  // Analytics methods
  async getAnalytics(surveyId, timeframe = '30d') {
    return this.request(\`/analytics/\${surveyId}?timeframe=\${timeframe}\`);
  }

  // Webhook methods
  async getWebhooks() {
    return this.request('/webhooks');
  }

  async createWebhook(webhookData) {
    return this.request('/webhooks', {
      method: 'POST',
      body: webhookData
    });
  }
}

module.exports = SurveyGuySDK;`;

    return {
      success: true,
      content: nodeContent,
      filename: 'index.js'
    };
  },

  // Generate cURL examples
  generateCurlExamples(data) {
    const curlContent = `# SurveyGuy API cURL Examples
# Generated: ${new Date().toISOString()}

# Set your API key
API_KEY="${data.apiKey}"
BASE_URL="${data.baseUrl}"

# Get all surveys
curl -H "X-API-Key: $API_KEY" \\
     "$BASE_URL/surveys"

# Get surveys with pagination
curl -H "X-API-Key: $API_KEY" \\
     "$BASE_URL/surveys?page=1&limit=10"

# Get a specific survey
curl -H "X-API-Key: $API_KEY" \\
     "$BASE_URL/surveys/{survey_id}"

# Create a new survey
curl -X POST \\
     -H "X-API-Key: $API_KEY" \\
     -H "Content-Type: application/json" \\
     -d '{"title": "Customer Satisfaction Survey", "description": "Help us improve our service"}' \\
     "$BASE_URL/surveys"

# Update a survey
curl -X PUT \\
     -H "X-API-Key: $API_KEY" \\
     -H "Content-Type: application/json" \\
     -d '{"title": "Updated Survey Title"}' \\
     "$BASE_URL/surveys/{survey_id}"

# Delete a survey
curl -X DELETE \\
     -H "X-API-Key: $API_KEY" \\
     "$BASE_URL/surveys/{survey_id}"

# Get survey responses
curl -H "X-API-Key: $API_KEY" \\
     "$BASE_URL/surveys/{survey_id}/responses"

# Submit a response
curl -X POST \\
     -H "X-API-Key: $API_KEY" \\
     -H "Content-Type: application/json" \\
     -d '{"survey_id": "survey_id", "responses": {"question_1": "answer_1"}}' \\
     "$BASE_URL/responses"

# Get survey analytics
curl -H "X-API-Key: $API_KEY" \\
     "$BASE_URL/analytics/{survey_id}?timeframe=30d"

# Get webhooks
curl -H "X-API-Key: $API_KEY" \\
     "$BASE_URL/webhooks"

# Create a webhook
curl -X POST \\
     -H "X-API-Key: $API_KEY" \\
     -H "Content-Type: application/json" \\
     -d '{"url": "https://your-app.com/webhook", "events": ["survey.created", "response.submitted"]}' \\
     "$BASE_URL/webhooks"`;

    return {
      success: true,
      content: curlContent,
      filename: 'curl-examples.sh'
    };
  },

  // Get main SDK file name
  getMainFileName(language) {
    const names = {
      javascript: 'surveyguy.js',
      python: 'surveyguy.py',
      php: 'SurveyGuySDK.php',
      node: 'index.js',
      curl: 'curl-examples.sh'
    };
    return names[language] || 'sdk.js';
  },

  // Generate main SDK file
  generateMainSDKFile(language, data) {
    switch (language) {
      case 'javascript':
        return this.generateJavaScriptSDK(data).content;
      case 'python':
        return this.generatePythonSDK(data).content;
      case 'php':
        return this.generatePHPSDK(data).content;
      case 'node':
        return this.generateNodeSDK(data).content;
      case 'curl':
        return this.generateCurlExamples(data).content;
      default:
        return this.generateJavaScriptSDK(data).content;
    }
  },

  // Get additional files for SDK
  getAdditionalFiles(language, data) {
    const files = [];

    // Package.json for Node.js
    if (language === 'node') {
      files.push({
        name: 'package.json',
        content: JSON.stringify({
          name: data.packageName,
          version: data.version,
          description: data.description,
          main: 'index.js',
          scripts: {
            test: 'echo "Error: no test specified" && exit 1'
          },
          keywords: ['survey', 'api', 'sdk', 'surveyguy'],
          author: data.author,
          license: data.license,
          dependencies: {}
        }, null, 2)
      });
    }

    // Requirements.txt for Python
    if (language === 'python') {
      files.push({
        name: 'requirements.txt',
        content: 'requests>=2.25.1'
      });
    }

    // Composer.json for PHP
    if (language === 'php') {
      files.push({
        name: 'composer.json',
        content: JSON.stringify({
          name: data.packageName,
          description: data.description,
          type: 'library',
          license: data.license,
          authors: [{
            name: data.author
          }],
          require: {
            php: '>=7.4'
          },
          autoload: {
            'psr-4': {
              'SurveyGuy\\\\': 'src/'
            }
          }
        }, null, 2)
      });
    }

    return files;
  },

  // Generate README
  generateReadme(language, data) {
    const readmes = {
      javascript: `# SurveyGuy JavaScript SDK

A JavaScript SDK for integrating with the SurveyGuy API.

## Installation

\`\`\`bash
# Include the SDK file in your HTML
<script src="surveyguy.js"></script>

# Or use as a module
import SurveyGuySDK from './surveyguy.js';
\`\`\`

## Usage

\`\`\`javascript
// Initialize the SDK
const sdk = new SurveyGuySDK('${data.apiKey}');

// Get all surveys
const surveys = await sdk.getSurveys();

// Create a new survey
const newSurvey = await sdk.createSurvey({
  title: 'My Survey',
  description: 'A sample survey'
});

// Submit a response
const response = await sdk.submitResponse({
  survey_id: 'survey-id',
  responses: {
    question_1: 'Answer 1'
  }
});
\`\`\`

## API Reference

See the examples folder for more detailed examples.

## Support

For support, please contact infoajumapro@gmail.com`,

      python: `# SurveyGuy Python SDK

A Python SDK for integrating with the SurveyGuy API.

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Usage

\`\`\`python
from surveyguy import SurveyGuySDK

# Initialize the SDK
sdk = SurveyGuySDK('${data.apiKey}')

# Get all surveys
surveys = sdk.get_surveys()

# Create a new survey
new_survey = sdk.create_survey({
    'title': 'My Survey',
    'description': 'A sample survey'
})

# Submit a response
response = sdk.submit_response({
    'survey_id': 'survey-id',
    'responses': {
        'question_1': 'Answer 1'
    }
})
\`\`\`

## API Reference

See the examples folder for more detailed examples.

## Support

For support, please contact infoajumapro@gmail.com`,

      php: `# SurveyGuy PHP SDK

A PHP SDK for integrating with the SurveyGuy API.

## Installation

\`\`\`bash
composer install
\`\`\`

## Usage

\`\`\`php
require_once 'SurveyGuySDK.php';

use SurveyGuy\\SurveyGuySDK;

// Initialize the SDK
$sdk = new SurveyGuySDK('${data.apiKey}');

// Get all surveys
$surveys = $sdk->getSurveys();

// Create a new survey
$newSurvey = $sdk->createSurvey([
    'title' => 'My Survey',
    'description' => 'A sample survey'
]);

// Submit a response
$response = $sdk->submitResponse([
    'survey_id' => 'survey-id',
    'responses' => [
        'question_1' => 'Answer 1'
    ]
]);
\`\`\`

## API Reference

See the examples folder for more detailed examples.

## Support

For support, please contact infoajumapro@gmail.com`,

      node: `# SurveyGuy Node.js SDK

A Node.js SDK for integrating with the SurveyGuy API.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`javascript
const SurveyGuySDK = require('./index.js');

// Initialize the SDK
const sdk = new SurveyGuySDK('${data.apiKey}');

// Get all surveys
const surveys = await sdk.getSurveys();

// Create a new survey
const newSurvey = await sdk.createSurvey({
  title: 'My Survey',
  description: 'A sample survey'
});

// Submit a response
const response = await sdk.submitResponse({
  survey_id: 'survey-id',
  responses: {
    question_1: 'Answer 1'
  }
});
\`\`\`

## API Reference

See the examples folder for more detailed examples.

## Support

For support, please contact infoajumapro@gmail.com`,

      curl: `# SurveyGuy API cURL Examples

This file contains cURL examples for integrating with the SurveyGuy API.

## Setup

1. Set your API key in the environment variable or replace \`$API_KEY\` in the examples
2. Make sure you have cURL installed

## Usage

Run any of the examples in this file:

\`\`\`bash
# Make the file executable
chmod +x curl-examples.sh

# Run examples (make sure to set your API key first)
export API_KEY="your-api-key-here"
./curl-examples.sh
\`\`\`

## API Reference

For detailed API documentation, visit https://docs.surveyguy.com

## Support

For support, please contact infoajumapro@gmail.com`
    };

    return readmes[language] || readmes.javascript;
  },

  // Generate example files
  generateExamples(language, data) {
    const examples = [];

    if (language === 'javascript') {
      examples.push({
        name: 'basic-usage.js',
        content: `// Basic usage example
const sdk = new SurveyGuySDK('${data.apiKey}');

async function example() {
  try {
    // Get all surveys
    const surveys = await sdk.getSurveys();
    console.log('Surveys:', surveys);

    // Create a new survey
    const newSurvey = await sdk.createSurvey({
      title: 'Customer Feedback',
      description: 'Help us improve our service',
      questions: [
        {
          type: 'rating',
          title: 'How satisfied are you?',
          required: true
        }
      ]
    });
    console.log('Created survey:', newSurvey);

  } catch (error) {
    console.error('Error:', error);
  }
}

example();`
      });
    }

    if (language === 'python') {
      examples.push({
        name: 'basic_usage.py',
        content: `# Basic usage example
from surveyguy import SurveyGuySDK

def example():
    sdk = SurveyGuySDK('${data.apiKey}')
    
    try:
        # Get all surveys
        surveys = sdk.get_surveys()
        print('Surveys:', surveys)
        
        # Create a new survey
        new_survey = sdk.create_survey({
            'title': 'Customer Feedback',
            'description': 'Help us improve our service',
            'questions': [
                {
                    'type': 'rating',
                    'title': 'How satisfied are you?',
                    'required': True
                }
            ]
        })
        print('Created survey:', new_survey)
        
    except Exception as error:
        print('Error:', error)

if __name__ == '__main__':
    example()`
      });
    }

    return examples;
  },

  // Download blob as file
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export default sdkService;
