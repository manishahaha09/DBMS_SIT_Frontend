// src/app/repositories/[id]/page.tsx

'use client';

import { useState } from 'react';
import React from 'react'; // Add this import if not already present


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
  {
    id: 2,
    name: 'Repo Two',
    description: 'Second repository',
    commits: [
      { id: 1, message: 'Initial commit', timestamp: '2024-10-01 11:00' },
      { id: 2, message: 'Updated homepage layout', timestamp: '2024-10-03 15:45' },
    ],
  },
  {
    id: 3,
    name: 'Repo Three',
    description: 'Third repository',
    commits: [
      { id: 1, message: 'Initial commit', timestamp: '2024-10-01 09:00' },
      { id: 2, message: 'Refactored API calls', timestamp: '2024-10-04 18:20' },
    ],
  },
];

const RepositoryDetail = ({ params }: { params: Promise<{ id: string }> }) => {
    const [selectedCommitId, setSelectedCommitId] = useState<number | null>(null);
  
    // Unwrap the params using React.use()
    const { id } = React.use(params);
    const repository = repositories.find((repo) => repo.id === Number(id));

  if (!repository) {
    return <p className="text-center text-xl mt-10">Repository not found</p>;
  }

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{repository.name}</h1>
      <p className="text-gray-700 mb-8">{repository.description}</p>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Commits</h2>
      <div className="flex">
        {/* Vertical timeline with circles */}
        <div className="relative flex flex-col items-center mr-8">
          <div className="absolute h-full w-1 bg-gray-300"></div>
          {repository.commits.map((commit) => (
            <button
              key={commit.id}
              onClick={() => setSelectedCommitId(commit.id)}
              className={`w-6 h-6 mb-4 rounded-full border-2 ${
                selectedCommitId === commit.id ? 'bg-blue-500 border-blue-500' : 'bg-gray-300 border-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Commit details */}
        <ul className="space-y-4 flex-1">
          {repository.commits.map((commit) => (
            <li
              key={commit.id}
              onClick={() => setSelectedCommitId(commit.id)}
              className={`p-4 rounded-lg shadow-md cursor-pointer transition duration-300 ${
                selectedCommitId === commit.id ? 'bg-blue-100' : 'bg-gray-100'
              }`}
            >
              <p className="text-gray-900 font-medium">{commit.message}</p>
              {selectedCommitId === commit.id && (
                <p className="text-gray-600 text-sm mt-2">{commit.timestamp}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default RepositoryDetail;
