import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { getSubCategoriesAction, uploadPost } from "../actions/postActions";
import Message from "./Message";
import Loader from "./Loader";
import { getCategoriesAction } from "../actions/userActions";

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

  useEffect(() => {
    if (!categoriesInfo) {
      dispatch(getCategoriesAction());
    } else {
      setCats(categoriesInfo.map((category) => category.name));
    }
  }, [dispatch, categoriesInfo]);

  useEffect(() => {
    if (category) {
      dispatch(getSubCategoriesAction(category));
    }
    if (sub_categoriesInfo) {
      setSubCats(sub_categoriesInfo.map((sub_cat) => sub_cat.name));
    }
  });

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
    <div className="relative top-44 md:w-1/3 mx-auto w-full">
      {loading && <Loader />}

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-16 bg-gradient-to-r from-blue-600 to-blue-700 p-8 rounded-md shadow-md"
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
          onChange={(e) => {
            setBody(e.target.value);
          }}
          placeholder="Body"
          required
          className="resize-y rounded-sm px-2 w-full h-40"
        />

        <label className="block mb-2">Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="rounded-sm px-2 w-full"
        >
          <option value="">Select a category</option>
          {cats.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label className="block mb-2">SubCategory:</label>
        <select
          value={category}
          onChange={(e) => setSubCategory(e.target.value)}
          required
          className="rounded-sm px-2 w-full"
        >
          <option value="">Select a Subcategory</option>
          <option value="category1">Category 1</option>
          <option value="category2">Category 2</option>
          <option value="category3">Category 3</option>
          {/* Add more options as needed */}
        </select>

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
