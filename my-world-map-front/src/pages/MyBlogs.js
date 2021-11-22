import { Link } from "react-router-dom";

const MyBlogs = () => {
  return (
    <div className="container">
      <h2>My blogs</h2>
      <Link to="/formNewBlog">
        <button className="btn btn-outline-success">Create new blog</button>
      </Link>
    </div>
  );
};

export default MyBlogs;
