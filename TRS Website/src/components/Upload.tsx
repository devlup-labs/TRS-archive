import { ChangeEvent, useState, useRef, useEffect } from "react";
export const Upload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Focus the file input when the component mounts
    if (fileInputRef.current) {
      fileInputRef.current.focus();
    }
  }, []);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<string[]>([]);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles([...selectedFiles, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setFilePreview([...filePreview, ...newPreviews]);
    }
  };
  const handleFileRemove = (index: number) => {
    const updatedFiles = [...selectedFiles];
    const updatedPreviews = [...filePreview];

    URL.revokeObjectURL(updatedPreviews[index]); // Revoke the object URL

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setSelectedFiles(updatedFiles);
    setFilePreview(updatedPreviews);
  };
  const handleFileUpload = () => {
    // Here you can perform any frontend operations with the selected files
    console.log("Files uploaded on the frontend:", selectedFiles);
  };

  return (
    <div className="relative top-44 md:w-1/2 border p-8 mx-auto w-full">
      <h1>Upload Documents</h1>
      <input
        type="file"
        name="documents"
        onChange={handleFileChange}
        multiple
      />
      <button onClick={handleFileUpload}>Upload</button>

      <div>
        {filePreview.map((preview, index) => (
          <div key={index}>
            <img
              src={preview}
              alt={`File Preview ${index}`}
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
            <button onClick={() => handleFileRemove(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};
