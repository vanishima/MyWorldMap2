import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";
import mapStyles from "../mapStyles";
import SpotWindow from "../components/SpotWindow";
import PostWindow from "../components/PostWindow";

const libraries = ["places"];
const mapContainerStyle = {
  height: "80vh",
  width: "100vw",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: true,
};
const center = {
  lat: 37.338207,
  lng: -121.88633,
};

async function getPosts() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("[Map.js] getPosts with user", user);
  if (user == null) {
    return fetch("./posts/public");
  } else {
    const authorId = user.id;
    console.log("authorId before fetch", authorId);
    console.log("token before fetch", localStorage.getItem("token"));
    return fetch("./posts", {
      method: "GET",
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    });
  }
}

async function drawPosts(setPosts) {
  console.log("[Map.js] drawPosts: starting");
  const resRaw = await getPosts();
  console.log("[Map.js] drawPosts: resRaw", resRaw);
  const res = await resRaw.json();
  // console.log("[Map.js] drawPosts: res", res);
  console.log("[Map.js] drawPosts: res.posts", await res.posts);
  await setPosts(res.posts);
}

export default function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);
  const [posts, setPosts] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [postSelected, setPostSelected] = React.useState(null);
  const onMapClick = React.useCallback((e) => {
    console.log(e);
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(18);
  }, []);

  React.useEffect(() => {
    console.log("### EFFECT ###");
    drawPosts(setPosts);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  // <h4 className="overlay">
  //         Drop your thoughts
  //         <span role="img" aira-label="tent">
  //           ⛺️
  //         </span>
  //       </h4>

  return (
    <div>
      <Locate panTo={panTo} />
      <Search panTo={panTo} />

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {markers.map((marker) => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker);
            }}
            icon={{
              url: "/icons/sunfish-1.png",
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ))}

        {posts &&
          posts.map((post, i) => (
            <Marker
              key={`${post.location.lat}-${post.location.lng}-${post.location.time}-${i}`}
              position={{ lat: post.location.lat, lng: post.location.lng }}
              onClick={() => {
                console.log("post clicked", post);
                setPostSelected(post);
              }}
              icon={{
                url: "/icons/dinosaur.png",
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15),
                scaledSize: new window.google.maps.Size(35, 35),
              }}
            />
          ))}

        {postSelected ? (
          <PostWindow
            post={postSelected}
            setPostSelected={setPostSelected}
            panTo={panTo}
          />
        ) : null}

        {selected ? (
          <SpotWindow
            selected={selected}
            setSelected={setSelected}
            panTo={panTo}
          />
        ) : null}
      </GoogleMap>
    </div>
  );
}

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img src="/icons/bi-compass-fill.svg" alt="compass - locate me" />
    </button>
  );
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 200 * 1000,
    },
  });

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Enter an address"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
