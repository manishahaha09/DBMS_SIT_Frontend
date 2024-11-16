"use client"
import React from 'react'
import IDEWindow from '../../../../../components/IDEWindow';
import { useParams } from 'next/navigation';


const EditPage = () => {
  const params = useParams()
  const { id, operation } = params as { id: string; operation: string }
  return <IDEWindow commitId={Number(id)!} operation={operation} />;
}

export default EditPage
