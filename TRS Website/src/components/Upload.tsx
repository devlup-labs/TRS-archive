import { jwtDecode } from "jwt-decode";
import { ChangeEvent, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the file input when the component mounts
    if (fileInputRef.current) {
      fileInputRef.current.focus();
    }
  }, []);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const authTokensString = localStorage.getItem("authTokens");
  const authTokens = JSON.parse(authTokensString||"");

  useEffect(() => {
    const token = localStorage.getItem("authTokens");
    if (token) {
      setEmail(jwtDecode(JSON.parse(token).access).email);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!selectedFile) {
      alert("Please select a file");
      console.error("Please select a file");
      return;
    }
  
    try {
      const { access, refresh } = authTokens;
      const formData = new FormData();
      formData.append('user', email);
      formData.append('title', title);
      formData.append('body', body);
      formData.append('document', selectedFile);
  
      const response = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${access}`
        },
        body: formData,
      });
  
      if (response.ok) {
        console.log("File successfully uploaded to the backend");
        setTitle("");
        setBody("");
        setSelectedFile(null);
        navigate("/");
      } else {
        console.error("Failed to upload file to the backend");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  

  return (
    <div className="relative top-44 md:w-1/3 mx-auto w-full">
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-16 bg-gradient-to-r from-red-600 to-red-800 p-8 rounded-md shadow-md"
      >
        <h1 className="block mb-2">Upload Documents</h1>
        <label className="block mb-2">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="rounded-sm px-2 w-full"
        />
        <label className="block mb-2">Body:</label>
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Body"
          required
          className="rounded-sm px-2 w-full"
        />
        <label className="block mb-2">Category:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
          className="rounded-sm px-2 w-full"
        />
        <label className="block mb-2">Sub Category:</label>
        <input
          type="text"
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          placeholder="Sub Category"
          required
          className="rounded-sm px-2 w-full"
        />
        <label className="block mb-2">Document (PDF only):</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-2"
        />
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Upload
        </button>
      </form>
    </div>
  );
};
