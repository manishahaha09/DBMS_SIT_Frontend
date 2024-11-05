'use client';

import { useState } from 'react';
import IDEWindow from '../components/IDEWindow';

const repositories = [
  {
    id: 1,
    name: 'Repo One',
    description: 'First repository',
    commits: [
      { id: 1, message: 'Initial commit', timestamp: '2024-10-01 10:00' },
      { id: 2, message: 'Added README', timestamp: '2024-10-02 12:30' },
    ],
  },
  // Add more repository data as needed
];

const RepositoryDetail = ({ params }: { params: { id: string } }) => {
  const [selectedCommitId, setSelectedCommitId] = useState<number | null>(null);
  const [isIDEOpen, setIsIDEOpen] = useState(false);
  const repository = repositories.find((repo) => repo.id === Number(params.id));

  if (!repository) {
    return <p className="text-center text-xl mt-10">Repository not found</p>;
  }

  const handleEditClick = (commitId: number) => {
    setSelectedCommitId(commitId);
    setIsIDEOpen(true);
  };

  if (isIDEOpen && selectedCommitId !== null) {
    return <IDEWindow commitId={selectedCommitId} />;
  }

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{repository.name}</h1>
      <p className="text-gray-700 mb-8">{repository.description}</p>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Commits</h2>
      <ul className="space-y-4">
        {repository.commits.map((commit) => (
          <li
            key={commit.id}
            className={`flex items-center p-4 rounded-lg shadow-md cursor-pointer transition duration-300 ${
              selectedCommitId === commit.id ? 'bg-blue-100' : 'bg-gray-100'
            }`}
            onClick={() => setSelectedCommitId(commit.id)}
          >
            <button
              className={`w-6 h-6 rounded-full border-2 mr-4 ${
                selectedCommitId === commit.id ? 'bg-blue-500 border-blue-500' : 'bg-gray-300 border-gray-300'
              }`}
            />
            <div className="flex-1">
              <p className="text-gray-900 font-medium">
                Commit #{commit.id}: {commit.message}
              </p>
              {selectedCommitId === commit.id && (
                <>
                  <p className="text-gray-600 text-sm mt-2">{commit.timestamp}</p>
                  <button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(commit.id);
                    }}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default RepositoryDetail;
