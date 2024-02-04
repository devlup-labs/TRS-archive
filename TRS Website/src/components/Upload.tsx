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
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
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
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        body: JSON.stringify({
          title,
          body,
          formData,
        }),
      });

      if (response.ok) {
        console.log("Files successfully uploaded to the backend");
        // Optionally, you can reset the selectedFiles and filePreview state after successful upload
        setSelectedFiles([]);
        setFilePreview([]);
      } else {
        console.error("Failed to upload files to the backend");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="relative top-44 md:w-1/3 mx-auto w-full">
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-16 bg-gradient-to-r from-red-600 to-red-800 text-white p-8 rounded-md shadow-md"
      >
        <h1>Upload Documents</h1>
        <label className="block mb-2">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <label className="block mb-2">Body:</label>
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Body"
          required
        />
        <label className="block mb-2">Documents:</label>
        <input
          type="file"
          name="documents"
          onChange={handleFileChange}
          multiple
        />
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Upload
        </button>

        <div>
          {filePreview.map((preview, index) => (
            <div key={index}>
              <button onClick={() => handleFileRemove(index)}>Remove</button>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};
