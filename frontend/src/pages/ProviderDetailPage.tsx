import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { History, Database } from 'lucide-react';
import api from '../api/client';
import { Provider, ProviderSource, ChangeLogEntry } from '../types';
import clsx from 'clsx';

interface ProviderDetailData {
  provider: Provider;
  sources: ProviderSource[];
  changes: ChangeLogEntry[];
}

const ProviderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ProviderDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/providers/${id}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching provider details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Provider not found</div>;

  const { provider, sources, changes } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 px-4 py-5 sm:rounded-xl sm:p-6 transition-colors">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate tracking-tight">
              {provider.full_name}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{provider.speciality}</p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <span className={clsx(
              'inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium',
              provider.risk_level === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
              provider.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            )}>
              Risk Level: {provider.risk_level.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{provider.phone}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{provider.address}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">License ID</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{provider.license_id || 'N/A'}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Confidence Score</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{(provider.confidence_score * 100).toFixed(1)}%</dd>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sources */}
        <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 sm:rounded-xl transition-colors">
          <div className="px-4 py-5 sm:px-6 flex items-center border-b border-gray-200 dark:border-gray-800">
            <Database className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Data Sources</h3>
          </div>
          <div>
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-800">
              {sources.map((source) => (
                <li key={source.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                      {source.field}: {source.value}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                        {source.source_type}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        Reliability: {(source.reliability_score * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                      <p>
                        Seen: {new Date(source.seen_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Change Log */}
        <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 sm:rounded-xl transition-colors">
          <div className="px-4 py-5 sm:px-6 flex items-center border-b border-gray-200 dark:border-gray-800">
            <History className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Change History</h3>
          </div>
          <div>
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-800">
              {changes.map((change) => (
                <li key={change.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {change.field} changed
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={clsx(
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                        change.change_type === 'auto' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      )}>
                        {change.change_type}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <p>From: <span className="line-through">{change.old_value || 'null'}</span></p>
                    <p>To: <span className="font-medium text-gray-900 dark:text-white">{change.new_value}</span></p>
                  </div>
                  <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    {new Date(change.created_at).toLocaleString()}
                  </div>
                </li>
              ))}
              {changes.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No changes recorded yet.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailPage;
