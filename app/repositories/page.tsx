"use client"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export type Repo = {
  id: number,
  name: string,
  commitCount: number, // New field for commit count
}

export type Repos = Repo[]

const RepositoriesPage = () => {
  const [repositories, setRepositories] = useState<Repo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newRepoName, setNewRepoName] = useState('');
  const [numberOfRepositories, setNumberOfRepositories] = useState('');
  const router = useRouter()

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const getRepos = async () => {
      const response = await axios.get(`http://localhost:6969/api/fetchRepos/${userId}`);
      const repos = response["data"];
      setRepositories(repos || []);
      const response2 = await axios.get(`http://localhost:6969/api/numberOfRepos/${userId}`)
      const numberOfRepos = response2.data.numberOfRepos
      setNumberOfRepositories(numberOfRepos)
      console.log(numberOfRepositories)
    };
    getRepos();
  }, []);


  const handleSelectRepository = async (repoId: number) => {
    localStorage.setItem("repoId", `${repoId}`);

    const getLatestCommitId = async (repoId: number) => {
      try {
        const response = await axios.get(`http://localhost:6969/api/fetchLatestCommitId/${repoId}`);
        const { commitId } = response.data;
        return commitId;
      } catch (e) {
        if (axios.isAxiosError(e) && e.response && e.response.status === 500) {
          console.warn("No commits found for this repository. Redirecting to create the first commit.");
          return 0; // Return 0 if no commits are found, indicating a new commit can be created
        } else {
          alert("An error occurred: " + e.message);
          return null; // Handle other errors
        }
      }
    }

    const latestCommitId = await getLatestCommitId(repoId);

    if (latestCommitId !== null) { // Check that latestCommitId is not null
      router.push(`http://localhost:3000/repositories/commits/${latestCommitId}/edit`);
    } else {
      console.log("Navigation canceled due to error.");
    }
  }; const handleAddRepository = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(`http://localhost:6969/api/createRepo`, {
        userId: Number(userId),
        repoName: newRepoName,
      });
      if (response.status === 201) {
        const { repoId, message } = response.data
        setRepositories([...(repositories ?? []), { id: repoId, name: newRepoName, commitCount: 0 }]);
        console.log(message)
        setNewRepoName('');
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error creating repository:', error);
    }
  };

  return (
    <main className="h-[100%] w-[100%] p-6">
      <div className="flex justify-between items-center bg-gray-700 p-6 rounded-3xl shadow-md h-full bg-opacity-30">
        <h1 className="text-4xl items-center font-bold text-center text-gray-300">Repositories</h1>
        <div className='flex flex-row justify-between gap-6 items-center'>
          <div className='text-gray-300'>Number Of Repositories: {numberOfRepositories}</div>
          <button
            className="bg-gray-600 hover:bg-gray-800 text-white font-bold p-4 rounded-3xl"
            onClick={() => setShowModal(true)}
          >
            Add Repository
          </button>
        </div>
      </div>
      <div className="mt-6 bg-gray-700 p-8 rounded-3xl h-[80vh] bg-opacity-30 relative">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 h-full w-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">

          <div className="contents">
            {repositories.map((repo) => (
              <div
                onClick={() => handleSelectRepository(repo.id)}
                key={repo.id}
                className="h-32"
              >
                <div className="bg-gray-600 bg-opacity-20 p-6 rounded-lg cursor-pointer hover:shadow-gray-500 shadow-lg transition-shadow duration-300 h-full w-full">
                  <h2 className="text-2xl font-semibold text-gray-300 mb-2 truncate">
                    {repo.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Commits: {repo.commitCount} {/* Display commit count */}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add Repository</h2>
            <div className="mb-4">
              <label htmlFor="newRepoName" className="block font-medium mb-2">
                Repository Name
              </label>
              <input
                id="newRepoName"
                type="text"
                value={newRepoName}
                onChange={(e) => setNewRepoName(e.target.value)}
                className="border rounded-md px-3 py-2 w-full"
                placeholder="Enter repository name"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleAddRepository}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default RepositoriesPage;
