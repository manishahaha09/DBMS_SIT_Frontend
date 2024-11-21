
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

export type Commit = {
  id: number,
  message: string,
  timeStamp: string,
  parentId: number,
}

export type Commits = Commit[]

const RepositoryDetail = () => {
  const { repoUserId } = useParams() as { repoUserId: string }
  const [selectedCommitId, setSelectedCommitId] = useState<number | null>(null);
  const [commits, setCommits] = useState<Commits>([])
  const router = useRouter()

  const getLatestCommit = (commits: Commit[]): Commit | null => {
    if (commits.length === 0) return null;

    return commits.reduce((latest, current) =>
      new Date(current.timeStamp) > new Date(latest.timeStamp) ? current : latest
    );
  };

  useEffect(() => {
    const repoId = localStorage.getItem("repoId");
    const fetchCommits = async () => {
      try {
        const response = await axios.get(`${process.env.BACKEND_URL}/api/fetchCommits/${repoId}`);
        setCommits(response.data);

        // If commits were fetched, set the latest commit ID
        if (response.data && response.data.length > 0) {
          const latestCommitId = getLatestCommit(response.data)?.id ?? null;
          setSelectedCommitId(latestCommitId); // Fallback to null if undefined
        }
      } catch (error) {
        console.error("Error fetching commits:", error);
      }
    };
    fetchCommits();
  }, []);

  const handleEditClick = (commitId: number, operation: string) => {
    router.push(`/repositories/${repoUserId}/commits/${commitId}/${operation}`)

  };

  return (
    <main className="p-6">
      <div className="flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow-md bg-opacity-30">
        <h2 className="text-3xl font-semibold text-gray-300">Commits</h2>

        <div className="flex gap-4">
          {selectedCommitId ? (
            <>
              {(selectedCommitId !== getLatestCommit(commits)?.id || repoUserId !== localStorage.getItem("userId")) ? (
                <>
                  <button
                    className="bg-gray-600 text-white p-4 rounded-lg shadow-md hover:bg-gray-800 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(selectedCommitId, "view");
                    }}
                  >
                    View
                  </button>
                </>
              ) : (
                <button
                  className="bg-gray-600 text-white p-4 rounded-lg shadow-md hover:bg-gray-800 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(selectedCommitId, "edit");
                  }}
                >
                  Edit
                </button>
              )}
            </>
          ) : repoUserId === localStorage.getItem("userId") && <button
            className="bg-gray-600 text-white p-4  rounded-lg shadow-md hover:bg-gray-900 transition"
            onClick={() => { router.push(`/repositories/${localStorage.getItem("userId")}/commits/0/edit`) }}
          >
            Create
          </button>
          }
        </div>
      </div>

      {commits.length === 0 || (commits.length === 1 && commits[0].id === 0) ? (
        <p className="text-gray-500 mt-6 text-center">No commits yet.</p>
      ) : (
        <ul className="space-y-4 mt-6 ms-">
          {commits.map((commit) => (
            <li
              key={commit.id}
              className={`flex items-center p-4 rounded-lg shadow-md transition-transform duration-200 cursor-pointer ${selectedCommitId === commit.id ? 'bg-blue-200' : 'bg-gray-100'
                } hover:bg-gray-200`}
              onClick={() => setSelectedCommitId(commit.id)}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 mr-4 ${selectedCommitId === commit.id ? 'bg-gray-800 border bg-opacity-30' : 'bg-gray-300 border-white'
                  }`}
              />
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Commit #{commit.id}</p>
                <p className="text-gray-700 text-sm">{commit.message}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default RepositoryDetail;
