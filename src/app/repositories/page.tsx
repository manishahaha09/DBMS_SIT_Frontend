// src/app/repositories/page.tsx

import Link from 'next/link';

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

const RepositoriesPage = () => {
  return (
    <main className="bg-[url('/img/bg.png')] bg-cover bg-no-repeat h-screen p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Repositories</h1>
      <div className="max-w-4xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {repositories.map((repo) => (
          <Link href={`/repositories/${repo.id}`} key={repo.id}>
            <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{repo.name}</h2>
              <p className="text-gray-700">{repo.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default RepositoriesPage;
