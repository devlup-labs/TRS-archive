
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { getSubCategoriesAction, uploadPost } from "../actions/postActions";
import Message from "./Message";
import Loader from "./Loader";
import { getCategoriesAction } from "../actions/postActions";

export const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [message, setMessage] = useState("");
  

  const postUpload = useSelector((state) => state.postUpload);
  const { error, loading, success } = postUpload;

  const [cats, setCats] = useState([]);
  const [subcats, setSubCats] = useState([]);

  const userLogin = useSelector((state) => state.userLogin);
  const { authToken } = userLogin;

  const getCategories = useSelector((state) => state.getCategories);
  const { loadingCat, successCat, categoriesInfo } = getCategories;

  const getSubCategories = useSelector((state) => state.getSubCategories);
  const { loadingSubCat, successSubCat, sub_categoriesInfo } = getSubCategories;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
if (!categoriesInfo) {
      dispatch(getCategoriesAction());
      
    }
   else {
      setCats(categoriesInfo.map((category) => category.name));
    }
  }, [categoriesInfo]);


  useEffect(() => {
    
    if(category && !sub_categoriesInfo){
      dispatch(getSubCategoriesAction(category));
    }
    if(sub_categoriesInfo){
      console.log("getting the sub_cat in frontend")
      setSubCats(sub_categoriesInfo.map((sub_cat) => sub_cat.name))
    }
  }, [sub_categoriesInfo,category]);

  

  useEffect(() => {
    // Focus the file input when the component mounts
    if (!authToken) {
      navigate("/login");
    } else {
      setEmail(authToken.email);
    }
    if (success) {
      navigate("/dashboard");
      window.location.reload();
    }
  }, [navigate, success]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage("Please select a File");
    } else {
      dispatch(
        uploadPost(email, title, body, category, subCategory, selectedFile)
      );
    }
  };

    return (
    <div className="relative md:w-1/2 mx-auto w-full">
      {loading && <Loader />}
      <div className="flex justify-between items-start">
        
        {message && <Message variant="danger">{message}</Message>}

        <form
          onSubmit={handleSubmit}
          className="p-4 w-full mx-auto bg-gradient-to-r from-blue-600 to-blue-700 shadow-md rounded-lg mt-48 flex flex-col space-y-4"
        >
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Upload Documents</h1>
          <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
            <div className="w-full md:w-1/2 pr-4">
              <div className="mb-4">
                <label className="block mb-2 text-white">Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  required
                  className="rounded-sm px-4 py-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-white">Body:</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your response here..."
                  required
                  className="w-full p-2 border border-gray-300 rounded-md resize-y h-40"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="mb-4">
                <label className="block mb-2 text-white">Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="rounded-sm px-4 py-2 w-full"
                >
                  <option value="">Select a category</option>
                  {cats.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-white">SubCategory:</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  required
                  className="rounded-sm px-4 py-2 w-full"
                >
                  <option value="">Select a subCategory</option>
                  {subcats.map((sub_cat, index) => (
                    <option key={index} value={sub_cat}>
                      {sub_cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-white">Document (PDF only):</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};
