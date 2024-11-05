'use client'
import { useState } from 'react';
import FileExplorer from './FileExplorer';

const IDEWindow = ({ commitId }: { commitId: number }) => {
  const [fileContent, setFileContent] = useState("")
  return (
    <div className="flex">
      <FileExplorer setContent={setFileContent} fileContent={fileContent}/>
      <div className="flex-1 p-8 bg-white flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Editing Commit #{commitId}</h1>
        <textarea
          className="w-full h-96 p-4 border border-gray-300 rounded-lg mb-4 flex-grow"
          placeholder="Edit code here..."
          value={fileContent}
          onChange={(e) => setFileContent(e.target.value)}
        />
        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
            onClick={() => console.log('Save clicked')}
          >
            Save
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            onClick={() => console.log('Commit clicked')}
          >
            Commit
          </button>
        </div>
      </div>
    </div>
  );
};

export default IDEWindow;
