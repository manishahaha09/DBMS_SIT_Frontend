
"use client";

import { useEffect, useState } from "react";
import React from "react";
import IDEWindow from "../../../../../../components/IDEWindow";
import { useParams } from "next/navigation";

const EditPage = () => {
  const params = useParams();
  const { id, operation, repoUserId } = params as {
    id: string;
    operation: string;
    repoUserId: string;
  };

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId === repoUserId || operation !== "edit") {
      setIsAuthorized(true);
    }
  }, [repoUserId, operation]);

  if (!isAuthorized) {
    return (
      <div className="flex justify-center items-center text-4xl text-white h-screen">
        Cannot Access this page!
      </div>
    );
  }

  return <IDEWindow commitId={Number(id)} operation={operation} repoUserId={repoUserId} />;
};

export default EditPage;

