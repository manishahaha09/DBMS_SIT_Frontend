'use client'
import { Dispatch, useState } from 'react';

const FileItem = ({ item, level, setContent, fileContent }: { item: any, level: number, setContent: Dispatch<string>, fileContent: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = item.type === 0;

  return (
    <li className={`ml-${level * 4}`}>
      {isFolder ? (
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          <span className="mr-2">{isOpen ? '📂' : '📁'}</span>
          {item.name}
        </div>
      ) : (
        <button className="ml-4 cursor-pointer" onClick={() => {setContent(item.content); console.log(fileContent);}}>📄 {item.name}</button>
      )}
      {isOpen && item.children && (
        <ul>
          {item.children.map((child: any) => (
            <FileItem key={child.id} item={child} level={level + 1} setContent={setContent} fileContent={fileContent} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default FileItem;
