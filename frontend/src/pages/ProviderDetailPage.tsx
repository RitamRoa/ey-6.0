import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, History, Database, AlertTriangle } from 'lucide-react';
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
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {provider.full_name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{provider.speciality}</p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <span className={clsx(
              'inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium',
              provider.risk_level === 'high' ? 'bg-red-100 text-red-800' :
              provider.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            )}>
              Risk Level: {provider.risk_level.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="mt-1 text-sm text-gray-900">{provider.phone}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Address</dt>
            <dd className="mt-1 text-sm text-gray-900">{provider.address}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">License ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{provider.license_id || 'N/A'}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Confidence Score</dt>
            <dd className="mt-1 text-sm text-gray-900">{(provider.confidence_score * 100).toFixed(1)}%</dd>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sources */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <Database className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Data Sources</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {sources.map((source) => (
                <li key={source.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {source.field}: {source.value}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {source.source_type}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Reliability: {(source.reliability_score * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
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
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <History className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Change History</h3>
          </div>
          <div className="border-t border-gray-200">
            {changes.length === 0 ? (
              <div className="px-4 py-5 text-sm text-gray-500">No changes recorded.</div>
            ) : (
              <ul role="list" className="divide-y divide-gray-200">
                {changes.map((change) => (
                  <li key={change.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        Updated {change.field}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(change.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <span className="line-through text-red-400">{change.old_value || 'Empty'}</span>
                        <span>&rarr;</span>
                        <span className="text-green-600 font-medium">{change.new_value}</span>
                      </div>
                      {change.reason && (
                        <p className="mt-1 text-xs text-gray-400 italic">
                          Reason: {change.reason}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailPage;
