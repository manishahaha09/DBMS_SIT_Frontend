'use client'
import { useEffect, useState } from 'react';
import FileExplorer from './FileExplorer';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export interface FileContentUpdate {
  id: number;
  content: string;
}

export type FileType = {
  id: number;
  name: string;
  type: 1 | 2;
  content?: string;
  children?: FileType[];
};

export type FileUpdate = {
  id: number;
  modification: string;
};

export type Updates = FileUpdate[];
export type FileStructure = FileType[];

const IDEWindow = ({ commitId, operation }: { commitId: number, operation: string }) => {
  const [activeFile, setActiveFile] = useState(0);
  const [newContent, setNewContent] = useState<FileContentUpdate>({ id: 0, content: "" });
  const [fileStructure, setFileStructure] = useState<FileStructure>([]);
  const [fileContent, setFileContent] = useState("");
  const [updatedFiles, setUpdatedFiles] = useState<Updates>([]);
  const [showCommitDialog, setShowCommitDialog] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    const getFileStructure = async () => {
      const url = `http://127.0.0.1:6969/api/fetchFiles/${commitId}`;
      const files = await axios.get(url);
      setFileStructure(files.data || []);
      console.log(fileStructure)
    };
    getFileStructure();
  }, [commitId]);

  const handleCommit = () => {
    if (updatedFiles.length > 0) {
      setShowCommitDialog(true); // Show dialog if there are updates
    } else {
      alert("No changes to commit.");
    }
  };

  const handleCommitConfirm = async () => {
    try {
      console.log("Sending commit data:", { commit: commitMessage, files: fileStructure });
      const response = await axios.post(

        `http://localhost:6969/api/commit/${localStorage.getItem("repoId")}`,
        { commit: commitMessage, files: fileStructure }
      );
      if (response.data.message === "Insertion Successful") {
        alert("Committed successfully");
        setUpdatedFiles([]); // Clear updated files after successful commit
        setCommitMessage(""); // Clear commit message
      }
    } catch (e) {
      alert(`Commit failed: ${e}`);
    } finally {
      setShowCommitDialog(false); // Close dialog
    }
    console.log(updatedFiles)
  };

  return (
    <div className="flex">
      <FileExplorer
        setContent={setFileContent}
        fileContent={fileContent}
        newContent={newContent}
        activeFile={activeFile}
        setActiveFile={setActiveFile}
        fileStructure={fileStructure}
        setFiles={setFileStructure}
        setUpdatedFiles={setUpdatedFiles}
        updatedFiles={updatedFiles}
      />
      <div className="flex-1 p-8 flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-gray-200">Editing Commit #{commitId}</h1>
        {activeFile !== 0 ? (
          <textarea
            className="w-full mt-4 h-96 p-4 bg-gray-900 bg-opacity-30 border border-gray-800 rounded-lg mb-4 flex-grow text-gray-200"
            placeholder="Edit code here..."
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <div className='text-gray-200'>Select a file to start working</div>
          </div>
        )}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="px-4 py-2 bg-red-400 text-white rounded-lg shadow hover:bg-blue-600 transition"
            onClick={() => router.push("http://localhost:3000/repositories/commits")}
          >
            See All Commits
          </button>
          {operation === "edit" ? (
            <>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                onClick={() => {
                  if (newContent.content === fileContent) return;
                  setNewContent({ id: activeFile, content: fileContent });
                  const index = updatedFiles.findIndex((update) => update.id === activeFile);
                  if (index !== -1) {
                    const updated = [...updatedFiles];
                    updated[index] = { id: activeFile, modification: "update" };
                    setUpdatedFiles(updated);
                  } else {
                    setUpdatedFiles([...updatedFiles, { id: activeFile, modification: "edit" }]);
                  }
                }}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                onClick={handleCommit}
              >
                Commit
              </button>
            </>
          ) : (
            <button className="px-4 py-2 bg-red-400 text-white rounded-lg shadow hover:bg-blue-600 transition">
              Revert
            </button>
          )}
        </div>
      </div>

      {/* Commit Message Dialog */}
      {showCommitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-2">Commit Message</h2>
            <textarea
              className="w-full p-2 border rounded mb-4"
              rows={3}
              placeholder="Enter your commit message..."
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded-lg shadow hover:bg-gray-400"
                onClick={() => setShowCommitDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                onClick={handleCommitConfirm}
              >
                Confirm Commit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IDEWindow;
