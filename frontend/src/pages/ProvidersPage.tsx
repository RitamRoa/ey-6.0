import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import api from '../api/client';
import { Provider } from '../types';
import clsx from 'clsx';

const ProvidersPage: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [validatingId, setValidatingId] = useState<string | null>(null);

  const fetchProviders = async () => {
    try {
      const response = await api.get('/providers', {
        params: { search }
      });
      setProviders(response.data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [search]);

  const handleValidate = async (id: string) => {
    setValidatingId(id);
    try {
      await api.post(`/providers/${id}/validate`);
      await fetchProviders(); // Refresh list
    } catch (error) {
      console.error('Error validating provider:', error);
    } finally {
      setValidatingId(null);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Providers</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all extracted healthcare providers including their risk status and confidence scores.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border"
              placeholder="Search providers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Speciality</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Risk Level</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Confidence</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4">Loading...</td>
                    </tr>
                  ) : providers.map((provider) => (
                    <tr key={provider.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {provider.full_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{provider.speciality}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{provider.phone}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={clsx(
                          'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                          provider.risk_level === 'high' ? 'bg-red-100 text-red-800' :
                          provider.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        )}>
                          {provider.risk_level.toUpperCase()}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          {provider.confidence_score > 0.8 ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          ) : provider.confidence_score > 0.5 ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          {Math.round(provider.confidence_score * 100)}%
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link to={`/providers/${provider.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          Details
                        </Link>
                        <button
                          onClick={() => handleValidate(provider.id)}
                          disabled={validatingId === provider.id}
                          className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                        >
                          {validatingId === provider.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            'Validate'
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvidersPage;
