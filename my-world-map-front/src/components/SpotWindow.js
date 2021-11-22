import { useState, useRef } from "react";
import myAuth from "../authStatus";
import { Button, Offcanvas, Overlay, Tooltip } from "react-bootstrap";
import { InfoWindow } from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import FormEditPost from "./FormEditPost";
import PropTypes from "prop-types";

const SpotWindow = ({ selected, setSelected, panTo }) => {
  const [diaryShow, setDiaryShow] = useState(false);
  const writeBtnRef = useRef(null);
  const [authWarnShow, setAuthWarnShow] = useState(false);
  const handleClose = () => setDiaryShow(false);
  const handleShow = async () => {
    const res = await myAuth.verifyAuth();
    if (res.valid) {
      // if logged in
      console.log("res valid");
      setDiaryShow(true);
    } else {
      console.log("Cannot edit post", res.msg);
      setAuthWarnShow(true);
    }
  };

  return (
    <div>
      <InfoWindow
        position={{ lat: selected.lat, lng: selected.lng }}
        onCloseClick={() => {
          setSelected(null);
        }}
      >
        <div>
          <h4>New post</h4>
          <p>Pinned {formatRelative(selected.time, new Date())}</p>
          <Button ref={writeBtnRef} variant="primary" onClick={handleShow}>
            Write a post
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
              <Offcanvas.Title>Write a diary</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <FormEditPost location={selected} panTo={panTo} />
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </InfoWindow>
    </div>
  );
};

SpotWindow.propTypes = {
  selected: PropTypes.object,
  setSelected: PropTypes.func,
  panTo: PropTypes.func,
};

export default SpotWindow;
