import { ApiTestComponent } from '../components/ApiTestComponent';

const ApiTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Finix AI API Integration Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Test the connection to your Finix AI API backend
          </p>
        </div>
        
        <ApiTestComponent />
        
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            ← Back to Todo App
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiTest; 