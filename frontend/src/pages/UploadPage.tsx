import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccessCount(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessCount(response.data.count);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Upload Provider Directory</h1>
      
      <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 sm:rounded-xl p-6 transition-colors">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              {file ? file.name : 'Click to upload PDF'}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {file ? 'Change file' : 'PDF files only'}
            </span>
          </label>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center text-red-700 dark:text-red-300 border border-red-100 dark:border-red-900/30">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {successCount !== null && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
            <div className="flex items-center text-green-700 dark:text-green-300 mb-2">
              <CheckCircle className="h-5 w-5 mr-2" />
              Successfully extracted {successCount} providers!
            </div>
            <button
              onClick={() => navigate('/providers')}
              className="text-sm font-medium text-green-700 dark:text-green-300 hover:text-green-600 dark:hover:text-green-200 underline"
            >
              View Providers &rarr;
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-5 w-5" />
                Extract Data
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
