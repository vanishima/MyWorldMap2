import { useState, useRef } from "react";
import { Button, Form, FloatingLabel } from "react-bootstrap";
import PropTypes from "prop-types";

async function createPost(post) {
  return fetch("./posts/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
    body: JSON.stringify(post),
  });
}

async function updatePost(post) {
  return fetch("./posts/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
    body: JSON.stringify(post),
  });
}

async function deletePost(post) {
  return fetch("./posts/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
    body: JSON.stringify(post),
  });
}

const FormEditPost = ({ location, post, panTo }) => {
  const [title, setTitle] = useState(post ? post.title : "");
  const [date, setDate] = useState(
    post
      ? new Date(post.date).toISOString().slice(0, -3)
      : new Date().toISOString().slice(0, -3)
  );
  const [content, setContent] = useState(post ? post.content : "");
  // const isPrivateRef = useRef(null);
  const [isPrivate, setIsPrivate] = useState(
    post && post.isPrivate ? true : false
  );

  const handleCheckBox = () => {
    setIsPrivate(!isPrivate);
  };

  const handleDelete = async (evt) => {
    evt.preventDefault();
    console.log("trying to delete", post);
    const resRaw = await deletePost(post);
    const res = await resRaw.json();

    if (resRaw.ok) {
      console.log("successfully deleted post");
      document.location.href = "/map";
    } else {
      console.log("Failed to post", res.msg);
    }
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const newPost = {
      title: title,
      date: date,
      content: content,
      authorId: post ? post.authorId : user._id,
      authorName: post ? post.authorName : user.name,
      isPrivate: isPrivate,
      location: post ? post.location : location,
    };
    console.log("new post", newPost);
    let resRaw;
    if (post) {
      newPost._id = post._id;
      resRaw = await updatePost(newPost);
    } else {
      resRaw = await createPost(newPost);
    }
    console.log("resRaw", resRaw);
    const res = await resRaw.json();
    console.log("res", res);

    if (resRaw.ok) {
      console.log("successfully created post");
      document.location.href = "/map";
      panTo(location ? location : post.location);
    } else {
      console.log("Failed to post", res.msg);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formTitle">
        <FloatingLabel
          controlId="floatingTextarea"
          label="Title"
          className="mb-3"
        >
          <Form.Control
            as="textarea"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </FloatingLabel>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formDatetime">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="datetime-local"
          min="1990-01-01T00:00:00.000Z"
          max="2099-12-31T23:55:55.000Z"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formContent">
        <FloatingLabel
          controlId="floatingTextarea"
          label="Content"
          className="mb-3"
        >
          <Form.Control
            as="textarea"
            placeholder="Write your thoughts here"
            style={{ height: "100px" }}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </FloatingLabel>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPrivateCheckbox">
        <Form.Label className="form-control">
          <input type="checkbox" onClick={handleCheckBox} checked={isPrivate} />{" "}
          Set as private
        </Form.Label>
      </Form.Group>
      <Button className="me-2" variant="primary" type="submit">
        {post ? "Update" : "Create"}
      </Button>
      {post && (
        <Button variant="danger" type="button" onClick={handleDelete}>
          Delete
        </Button>
      )}
    </Form>
  );
};

// <Form.Check
//   type="checkbox"
//   label="Set as private"
//   checked={post ? post.isPrivate : false}
//   ref={isPrivateRef}
// />

FormEditPost.propTypes = {
  post: PropTypes.object,
  location: PropTypes.object,
  panTo: PropTypes.func,
};

export default FormEditPost;
