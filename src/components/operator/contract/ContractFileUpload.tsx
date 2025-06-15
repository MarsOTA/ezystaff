
import React from "react";

interface ContractFileUploadProps {
  signedContractFile: File | null;
  setSignedContractFile: (file: File | null) => void;
  onTemplateUpload?: (file: File | null) => void;
  unilavFile: File | null;
  setUnilavFile: (file: File | null) => void;
}

const ContractFileUpload: React.FC<ContractFileUploadProps> = ({
  signedContractFile,
  setSignedContractFile,
  onTemplateUpload,
  unilavFile,
  setUnilavFile,
}) => {
  // Contratto firmato
  const handleSignedContractUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSignedContractFile(file);
    if (file && typeof window !== "undefined") {
      if (typeof onTemplateUpload === "function") {
        onTemplateUpload(file);
      }
    }
  };

  // UNILAV upload
  const handleUnilavUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUnilavFile(file);
  };

  return (
    <>
      <div>
        <label className="block mb-1 font-semibold">
          Carica contratto firmato (.pdf)
        </label>
        <input type="file" accept=".pdf" onChange={handleSignedContractUpload} />
        {signedContractFile && (
          <span className="ml-2 text-sm text-primary">{signedContractFile.name}</span>
        )}
      </div>
      <div>
        <label className="block mb-1 font-semibold">
          Carica UNILAV (.pdf)
        </label>
        <input type="file" accept=".pdf" onChange={handleUnilavUpload} />
        {unilavFile && (
          <span className="ml-2 text-sm text-primary">{unilavFile.name}</span>
        )}
      </div>
    </>
  );
};

export default ContractFileUpload;
