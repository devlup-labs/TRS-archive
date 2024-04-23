
import { ChangeEvent,useEffect, useRef,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { uploadPost } from "../actions/postActions";
import Message from "./Message";
import Loader from "./Loader";

export const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [message, setMessage] = useState("");

  const postUpload=useSelector((state)=>state.postUpload)
  const {error,loading,success}=postUpload;




  const userLogin = useSelector((state) => state.userLogin);
  const { authToken } = userLogin;




  const navigate = useNavigate();
  const dispatch=useDispatch()



  useEffect(() => {
    // Focus the file input when the component mounts
    if (!authToken) {
      navigate("/login");
    }
    else{
      setEmail(authToken.email)
    }
    if (success){
      navigate("/dashboard")
    }
    
    
   
  }, [navigate,success]);


   



const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file)
      setSelectedFile(file);
    }
  };


  
const handleSubmit=(e) => {
  e.preventDefault();
     if (!selectedFile) {
      setMessage("Please select a File")
    }
    else{
      dispatch(uploadPost(email,title,body,category,subCategory,selectedFile))
      
    }
    
}




  return (
    <div className="relative top-44 md:w-1/3 mx-auto w-full">
      {loading && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-16 bg-gradient-to-r from-red-600 to-red-800 p-8 rounded-md shadow-md"
      >
        <h1 className="block mb-2">Upload Documents</h1>
        {message && <Message variant="danger">{message}</Message>}
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
          type="textarea"
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
