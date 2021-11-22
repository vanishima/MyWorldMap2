import { useState, useRef } from "react";
import myAuth from "../authStatus";
import { Button, Offcanvas, Overlay, Tooltip } from "react-bootstrap";
import { InfoWindow } from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import FormEditPost from "./FormEditPost";
import PropTypes from "prop-types";

const PostWindow = ({ post, setPostSelected, panTo }) => {
  const [diaryShow, setDiaryShow] = useState(false);
  const writeBtnRef = useRef(null);
  const [authWarnShow, setAuthWarnShow] = useState(false);
  // const handleClose = () => setDiaryShow(false);
  const handleClose = () => setDiaryShow(false);
  const handleShow = async () => {
    const res = await myAuth.verifyAuth();
    console.log("handleShow: ", res);
    if (res.valid) {
      // if logged in
      setDiaryShow(true);
    } else {
      console.log("message", res.msg);
      setAuthWarnShow(true);
    }
  };

  return (
    <div>
      <InfoWindow
        position={{ lat: post.location.lat, lng: post.location.lng }}
        onCloseClick={() => {
          console.log("InfoWindow close click");
          setPostSelected(null);
        }}
      >
        <div>
          <h4>{post.title}</h4>
          <p>Created {formatRelative(new Date(post.date), new Date())}</p>
          <Button ref={writeBtnRef} variant="primary" onClick={handleShow}>
            Edit
          </Button>

          <Overlay
            target={writeBtnRef.current}
            show={authWarnShow}
            placement="right"
          >
            {(props) => (
              <Tooltip id="authWarnOverlay" {...props}>
                Please register or login first!
              </Tooltip>
            )}
          </Overlay>

          <Offcanvas
            show={diaryShow}
            onHide={handleClose}
            scroll={false}
            backdrop={true}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Edit Post</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <FormEditPost post={post} panTo={panTo} />
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </InfoWindow>
    </div>
  );
};

PostWindow.propTypes = {
  post: PropTypes.object,
  setPostSelected: PropTypes.func,
  panTo: PropTypes.func,
};

export default PostWindow;
