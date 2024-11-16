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
  id: number;          // Unique identifier for the file or folder
  name: string;        // Name of the file or folder
  type: 1 | 2;         // 0 for folder, 1 for file
  content?: string;    // Content of the file (only present if type is 1)
  children?: FileType[];   // Children files/folders (only present if type is 0)
};

export type FileUpdate = {
  id: number;
  modification: string; //edit, delete or create
}

export type Updates = FileUpdate[]
export type FileStructure = FileType[];

const IDEWindow = ({ commitId, operation }: { commitId: number, operation: string }) => {
  const [activeFile, setActiveFile] = useState(0)
  const [newContent, setNewContent] = useState<FileContentUpdate>({
    id: 0,
    content: "",
  })
  // const [uppdatedContent, setUpdatedContent] = useState<UpdateArray>([])
  const [fileStructure, setFileStructure] = useState<FileStructure>([])
  const [fileContent, setFileContent] = useState("")
  const [updatedFiles, setUpdatedFiles] = useState<Updates>([])

  const router = useRouter()
  localStorage.setItem("userId", "1")
  localStorage.setItem("commitId", "2")

  useEffect(() => {
    const getFileStructure = async () => {
      const url = `http://127.0.0.1:6969/api/fetchFiles/${commitId}`
      const files = await axios.get(url)
      setFileStructure(files["data"])
    }
    getFileStructure()
  }, [])

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
        {activeFile !== 0 ?
          <textarea
            className="w-full mt-4 h-96 p-4 bg-gray-900 bg-opacity-30 border border-gray-800 rounded-lg mb-4 flex-grow text-gray-200"
            placeholder="Edit code here..."
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
          /> :
          <div className='w-full h-full flex items-center justify-center'>
            <div className='text-gray-200'>Select a file to start working</div>
          </div>
        }
        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="px-4 py-2 bg-red-400 text-white rounded-lg shadow hover:bg-blue-600 transition"
            onClick={() => {
              router.push("http://localhost:3000/repositories/commits")

            }}
          >
            See All Commits
          </button>
          {operation === "edit" ?
            <>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                onClick={() => {
                  if (newContent.content === fileContent) {
                    return
                  }
                  setNewContent({
                    id: activeFile,
                    content: fileContent
                  })
                  const index = updatedFiles.findIndex(update => update.id === activeFile);

                  if (index !== -1) {
                    // If the file exists, modify the modification field
                    const updated = [...updatedFiles];
                    updated[index] = { id: activeFile, modification: "update" }; // Update modification to "edit"
                    setUpdatedFiles(updated);
                  } else {
                    // If it doesn't exist, add the new update
                    setUpdatedFiles([...updatedFiles, { id: activeFile, modification: "edit" }]);
                  }
                }
                }
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                onClick={() => console.log(updatedFiles)}
              >
                Commit
              </button>
            </>
            : <button
              className="px-4 py-2 bg-red-400 text-white rounded-lg shadow hover:bg-blue-600 transition"
            >
              Revert
            </button>
          }
        </div>
      </div>
    </div >
  );
};

export default IDEWindow;
