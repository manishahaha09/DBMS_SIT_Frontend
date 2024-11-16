'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import FileItem from './FileItem';
import { FileContentUpdate, FileStructure, FileType, Updates } from './IDEWindow';

interface FileExplorerProps {
  setContent: Dispatch<SetStateAction<string>>;
  fileContent: string;
  newContent: FileContentUpdate;
  activeFile: number;
  setActiveFile: React.Dispatch<number>;
  fileStructure: FileStructure;
  setFiles: Dispatch<FileStructure>;
  updatedFiles: Updates
  setUpdatedFiles: Dispatch<Updates>;
}

const updateFileContentById = (fileStructure: FileStructure, id: number, newContent: string) => {
  for (const item of fileStructure) {
    if (item.id === id && item.type === 1) {
      item.content = newContent;
      return true;
    } else if (item.children) {
      const updated = updateFileContentById(item.children, id, newContent);
      if (updated) return true;
    }
  }
  return false;
};

const FileExplorer: React.FC<FileExplorerProps> = ({
  setContent,
  fileContent,
  newContent,
  activeFile,
  setActiveFile,
  fileStructure,
  setFiles,
  updatedFiles,
  setUpdatedFiles
}: FileExplorerProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<1 | 2>(1);

  useEffect(() => {
    updateFileContentById(fileStructure, newContent.id, newContent.content);
  }, [newContent, fileStructure]);

  const handleAddFile = () => {
    const newFile: FileType = {
      id: Date.now(), // Using timestamp as unique ID
      name: newFileName,
      type: newFileType,
      content: newFileType === 1 ? "New file content" : undefined,
      children: newFileType === 2 ? [] : undefined,
    };
    setFiles([...fileStructure, newFile]);
    setShowAddDialog(false);
  };

  return (
    <div className="px-4 py-2 border border-gray-600 w-64 h-[100vh]">
      <div className='flex flex-row justify-between'>
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Explorer</h2>
        <button
          onClick={() => setShowAddDialog(true)}
          className="text-lg font-semibold mb-4 text-gray-200 hover:bg-gray-600 px-2 rounded-lg"
        >+</button>
      </div>
      <ul>
        {fileStructure.map((item) => (
          <FileItem
            key={item.id}
            item={item}
            level={0}
            setContent={setContent}
            activeFile={activeFile}
            setActiveFile={setActiveFile}
            files={fileStructure}
            fileContent={fileContent}
            setFiles={setFiles}
            setUpdatedFiles={setUpdatedFiles}
            updatedFiles={updatedFiles}
          />
        ))}
      </ul>

      {showAddDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h3>Add File or Folder</h3>
            <input
              type="text"
              placeholder="Enter name"
              className="input-field"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
            />
            <select
              className="input-field"
              value={newFileType}
              onChange={(e) => setNewFileType(Number(e.target.value) as 1 | 2)}
            >
              <option value={1}>File</option>
              <option value={2}>Folder</option>
            </select>
            <div className='flex flex-row justify-between'>
              <button onClick={handleAddFile} className="btn-confirm">Yes</button>
              <button onClick={() => setShowAddDialog(false)} className="btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
