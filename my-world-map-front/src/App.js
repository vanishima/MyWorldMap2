import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBlogs from "./pages/MyBlogs";
import MyGallery from "./pages/MyGallery";
import MyMap from "./pages/Map";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/myblogs" element={<MyBlogs />} />
          <Route path="/myphotos" element={<MyGallery />} />
          <Route path="/map" element={<MyMap />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
