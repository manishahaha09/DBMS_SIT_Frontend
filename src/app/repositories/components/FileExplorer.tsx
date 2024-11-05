'use client'
import { Dispatch, SetStateAction, useState } from 'react';
import FileItem from './FileItem';

const fileStructure = [
  { id: 1, name: 'src', type: 0, children: [
      { id: 2, name: 'index.js', type: 1, content:"" },
      { id: 3, name: 'App.js', type: 1, content: "" },
      { id: 4, name: 'components', type: 0, children: [
          { id: 5, name: 'Header.js', type: 1, content: "" },
          { id: 6, name: 'Footer.js', type: 1, content: 'Hello world' },
      ], content:"" },
  ], content:""},
  { id: 7, name: 'package.json', type: 1, content:"Manisha sucks gagan" },
  { id: 8, name: 'README.md', type: 1, content:"" },
];

interface FileExplorerProps {
  setContent: Dispatch<SetStateAction<string>>;
  fileContent: string;
}


const FileExplorer: React.FC<FileExplorerProps> = ({ setContent , fileContent}) => {
  return (
    <div className="p-4 bg-gray-100 w-64">
      <h2 className="text-lg font-semibold mb-4">Explorer</h2>
      <ul>
        {fileStructure.map((item) => (
          <FileItem key={item.id} item={item} level={0} setContent={setContent} fileContent={fileContent} />
        ))}
      </ul>
    </div>
  );
};

export default FileExplorer;
