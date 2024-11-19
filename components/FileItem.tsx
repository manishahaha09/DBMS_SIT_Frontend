"use client"
import { Dispatch, useState } from 'react';
import { FileStructure, FileType, Updates } from './IDEWindow';

export const getMaxFileId = (fileStructure: FileStructure): number => {
  let maxId = 0;
  const traverse = (files: FileType[]) => {
    files.forEach((file) => {
      if (file.id > maxId) {
        maxId = file.id;
      }
      if (file.children) {
        traverse(file.children);
      }
    });
  };
  traverse(fileStructure);
  return maxId;
};



const FileItem = ({ item, level, setContent, activeFile, setActiveFile, fileContent, setFiles, files, updatedFiles, setUpdatedFiles }: {
  item: FileType,
  level: number,
  setContent: Dispatch<string>,
  activeFile: number,
  setActiveFile: Dispatch<number>,
  setFiles: Dispatch<FileStructure>,
  fileContent: string,
  files: FileStructure,
  updatedFiles: Updates,
  setUpdatedFiles: Dispatch<Updates>
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newFileType, setNewFileType] = useState<1 | 2>(1);
  const [newFileName, setNewFileName] = useState('');
  const isFolder = item.type === 2;

  // const getMaxFileId = (fileStructure: FileStructure): number => {
  //   let maxId = 0;
  //   const traverse = (files: FileType[]) => {
  //     files.forEach((file) => {
  //       if (file.id > maxId) {
  //         maxId = file.id;
  //       }
  //       if (file.children) {
  //         traverse(file.children);
  //       }
  //     });
  //   };
  //   traverse(fileStructure);
  //   return maxId;
  // };

  let lastId = getMaxFileId(files);

  const handleAddFile = (parentId: number) => {
    const newFile: FileType = {
      id: (++lastId),
      name: newFileName,
      type: newFileType,
      content: newFileType === 1 ? "" : undefined,
      children: newFileType === 2 ? [] : undefined,
    };

    function addFileToStructure(files: FileStructure, parentId: number, newFile: FileType): FileStructure {
      return files.map(file => {
        if (file.id === parentId && file.children) {
          return { ...file, children: [...file.children, newFile] };
        } else if (file.children) {
          return { ...file, children: addFileToStructure(file.children, parentId, newFile) };
        }
        return file;
      });
    }
    setFiles(addFileToStructure(files, parentId, newFile));
    setUpdatedFiles([...updatedFiles, {
      id: newFile.id,
      modification: "create"
    }])
    setShowAddDialog(false);
  };

  const handleDeleteFile = (fileId: number) => {
    const deleteFileRecursively = (files: FileStructure): FileStructure => {
      return files
        .filter(file => file.id !== fileId)
        .map(file => ({
          ...file,
          children: file.children ? deleteFileRecursively(file.children) : undefined,
        }));
    };
    setFiles(deleteFileRecursively(files));
    const index = updatedFiles.findIndex(update => update.id === fileId)

    if (index !== -1) {
      const updated = updatedFiles
      updated[index] = { id: fileId, modification: "delete" }
      setUpdatedFiles(updated)
    } else {
      setUpdatedFiles([...updatedFiles, {
        id: fileId,
        modification: "delete"
      }])
    }

    setUpdatedFiles([...updatedFiles, {
      id: fileId,
      modification: "delete"
    }])
    setShowDeleteDialog(false);
  };

  return (
    <li style={{ paddingLeft: `${level * 16}px` }} className="w-full">
      {isFolder ? (
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer text-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-600 px-2">
          <div className='flex items-center py-2'>
            <span className="mr-2">{isOpen ? '📂' : '📁'}</span>
            <span>{item.name}</span>
          </div>
          <div className='flex flex-row gap-2'>
            <button
              className='hover:bg-gray-500 max-h-[24px] px-2 rounded-lg'
              onClick={(e) => {
                e.stopPropagation();
                setShowAddDialog(true);
                setIsOpen(true);
              }}
            >+</button>
            <button
              className='hover:bg-gray-500 max-h-[24px] px-2 rounded-lg'
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
            >-</button>
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-row rounded-lg p-2 justify-between cursor-pointer w-full text-left hover:bg-gray-600 text-gray-200 ${activeFile === item.id ? "bg-gray-600" : ""}`}
          onClick={() => {
            setContent(item.content!);
            setActiveFile(item.id);
          }}
        >
          <div>
            📄 {item.name}
          </div>
          <button
            className='hover:bg-gray-500 max-h-[24px] px-2 rounded-lg'
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
          >-</button>
        </div>
      )}

      {isOpen && item.children && (
        <ul>
          {item.children.map((child: FileType) => (
            <FileItem
              key={child.id}
              item={child}
              level={level + 1}
              setContent={setContent}
              fileContent={fileContent}
              activeFile={activeFile}
              setActiveFile={setActiveFile}
              setFiles={setFiles}
              files={files}
              updatedFiles={updatedFiles}
              setUpdatedFiles={setUpdatedFiles}
            />
          ))}
        </ul>
      )}

      {/* Add File/Folder Dialog */}
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
              <button onClick={() => handleAddFile(item.id)} className="btn-confirm">Add</button>
              <button onClick={() => setShowAddDialog(false)} className="btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete {item.name}?</p>
            <div className='flex flex-row justify-between mt-6'>
              <button onClick={() => handleDeleteFile(item.id)} className="btn-confirm">Yes</button>
              <button onClick={() => setShowDeleteDialog(false)} className="btn-cancel">No</button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default FileItem;
