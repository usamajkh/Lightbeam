import React, { useState, useEffect } from "react";
import screenfull from "screenfull";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import Entur from "./Entur"; // Import Entur component
import "./Office.css";
import "./index.css";
import bg from "./images/bg.png";

const OfficeScreen = ({
  officeScreenContent,
  handleDeleteItems,
  toggleLinkVisibility,
}) => {
  const [showButton, setShowButton] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [users, setUsers] = useState({});
  const [departures, setDepartures] = useState([]); // State for departures
  const [addButtonStyle, setAddButtonStyle] = useState({});
  const [deleteButtonStyle, setDeleteButtonStyle] = useState({});
  const [editButtonStyle, setEditButtonStyle] = useState({});

  useEffect(() => {
    if (screenfull.isEnabled) {
      const changeHandler = () => {
        setShowButton(!screenfull.isFullscreen);
        toggleLinkVisibility();
        if (!screenfull.isFullscreen) {
          const element = document.getElementById("office-screen-container");
          if (element) {
            element.style.transform = "";
          }
        }
      };
      screenfull.on("change", changeHandler);
      return () => {
        screenfull.off("change", changeHandler);
      };
    }
  }, [toggleLinkVisibility]);

  useEffect(() => {
    const handleKeyUp = (event) => {
      if (event.key === "Escape" && screenfull.isFullscreen) {
        screenfull.exit();
      }
    };

    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      return response.data.name;
    } catch (error) {
      console.error(`Error fetching user data for user_id ${userId}:`, error);
      return "Unknown User";
    }
  };

  const fetchUsers = async () => {
    const uniqueUserIds = [
      ...new Set(
        officeScreenContent
          .filter((entry) => entry.table === "comments")
          .map((entry) => entry.user_id)
      ),
    ];
    const userData = {};
    for (const userId of uniqueUserIds) {
      userData[userId] = await fetchUserData(userId);
    }
    setUsers(userData);
  };

  useEffect(() => {
    fetchUsers();
  }, [officeScreenContent]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("no-NO", options);
  };

  const isFutureOrToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    today.setHours(0, 0, 0, 0); // Set the time to midnight to compare only dates
    date.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const renderEntry = (entry, index) => {
    let content;
    switch (entry.table) {
      case "events":
        content = (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "20px", // Reduced padding
              marginBottom: "0px", // Reduced margin
            }}
          >
            <span style={{ textAlign: "left" }}>
              {entry.title || "No Title"}
            </span>
            <span style={{ textAlign: "center" }}>
              {entry.description || "No Description"}
            </span>
            <span style={{ textAlign: "right" }}>{formatDate(entry.date)}</span>
          </div>
        );
        break;
      case "canteenMenu":
        const menu = Array.isArray(entry.menu)
          ? entry.menu.join(", ")
          : entry.menu;
        content = (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "20px", // Reduced padding
              marginBottom: "5px", // Reduced margin
            }}
          >
            <span style={{ textAlign: "left", flex: 1 }}>
              {menu || "No Menu"}
            </span>
            <span style={{ textAlign: "right", flex: 1 }}>
              {formatDate(entry.date)}
            </span>
          </div>
        );
        break;
      case "comments":
        content = (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "10px", // Reduced padding
              marginBottom: "10px", // Reduced margin
            }}
          >
            <span style={{ textAlign: "left", flex: 1 }}>
              {entry.content || "No Comment"}
            </span>
            <span style={{ textAlign: "right", flex: 1 }}>
              {users[entry.user_id] || "Unknown User"}
            </span>
          </div>
        );
        break;
      default:
        content = (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "10px", // Reduced padding
              marginBottom: "10px", // Reduced margin
            }}
          >
            <span style={{ textAlign: "left" }}>{entry.comment}</span>
          </div>
        );
    }

    return (
      <div
        key={index}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {editMode && (
          <input
            type="checkbox"
            checked={selectedItems.includes(entry)}
            onChange={() => toggleSelection(entry)}
          />
        )}
        {content}
      </div>
    );
  };

  const renderDeparture = (departure, index) => {
    return (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "10px", // Reduced padding
          marginBottom: "10px", // Reduced margin
        }}
      >
        <span style={{ textAlign: "left", flex: 1, color: "#40547a" }}>
          {departure.serviceJourney.journeyPattern.line.name || "No Title"}
        </span>
        <span style={{ textAlign: "center", flex: 1, color: "#40547a" }}>
          {departure.destinationDisplay.frontText || "No Destination"}
        </span>
        <span style={{ textAlign: "right", flex: 1, color: "#40547a" }}>
          {new Date(departure.expectedArrivalTime).toLocaleTimeString()}
        </span>
      </div>
    );
  };

  const toggleFullscreen = () => {
    if (screenfull.isEnabled) {
      if (!screenfull.isFullscreen) {
        const element = document.getElementById("office-screen-container");
        if (element) {
          const rect = element.getBoundingClientRect();
          const minScale = 0.7; // Set a minimum scale value to ensure it's not too small
          const scale = Math.max(
            minScale,
            Math.min(
              window.innerWidth / rect.width,
              window.innerHeight / rect.height
            )
          );
          // element.style.transform = `scale(${scale})`;
          element.style.transformOrigin = "top center";
          // element.style.margin = "0 auto";
        }
      } else {
        const element = document.getElementById("office-screen-container");
        if (element) {
          element.style.transform = "";
          element.style.margin = "";
        }
      }
      screenfull.toggle();
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setSelectedItems([]); // Clear selections when toggling edit mode
  };

  const toggleSelection = (entry) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(entry)) {
        return prevSelected.filter((item) => item !== entry);
      } else {
        return [...prevSelected, entry];
      }
    });
  };

  const handleDelete = () => {
    handleDeleteItems(selectedItems);
    setEditMode(false); // Toggle back to normal mode
    setSelectedItems([]); // Clear selected items
  };

  // Sort entries by date in ascending order and filter out expired items
  const sortedEntries = (entries) => {
    return entries
      .filter((entry) => isFutureOrToday(entry.date))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Styles
  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: "20px",
    columnGap: "60px",
    rowGap: "30px",
    backgroundSize: "cover", // Adjust background size
  };

  const sectionStyle = {
    backgroundColor: "rgba(249, 247, 244)",
    color: "black",
    borderRadius: "25px",
    padding: "20px",
    marginBottom: "0px",
    width: "400px",
    height: "auto",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    marginTop: "35px",
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: "30px",
    marginTop: "0px",
    color: "black",
  };

  const subtitleStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 20px",
    fontWeight: "bold",
  };

  const iconButtonStyle = {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
    marginLeft: "10px",
    marginTop: "20px",
  };

  const buttonStyle = {
    backgroundColor: "#242f45",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "5px",
    marginRight: "10px",
    transition: "background-color 0.3s, color 0.3s",
  };

  const handleMouseEnter = (setButtonStyle) => {
    setButtonStyle({
      backgroundColor: "#242f45",
      color: "white",
    });
  };

  const handleMouseLeave = (setButtonStyle) => {
    setButtonStyle({});
  };

  return (
    <div
      id="office-screen-container"
      style={{
        minHeight: "100vh",
        padding: "20px",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover", // Adjust this value as needed
        backgroundRepeat: "no-repeat", // Adjust this value as needed
        backgroundPosition: "center", // Adjust this value as needed
      }}
    >
      {showButton && (
        <div
          className="fullscreen-button-container"
          style={{
            marginTop: "20px",
            marginBottom: "20px",
            textAlign: "right",
            fontSize: "20px",
            marginRight: "20px",
          }}
        >
          <button
            onClick={toggleFullscreen}
            style={{ ...buttonStyle, ...addButtonStyle }}
            onMouseEnter={() => handleMouseEnter(setAddButtonStyle)}
            onMouseLeave={() => handleMouseLeave(setAddButtonStyle)}
          >
            {screenfull.isFullscreen ? "Exit Fullscreen" : "Fullskjerm"}
          </button>
          {!screenfull.isFullscreen && (
            <>
              <button
                onClick={toggleEditMode}
                style={{ ...buttonStyle, ...editButtonStyle }}
                onMouseEnter={() => handleMouseEnter(setEditButtonStyle)}
                onMouseLeave={() => handleMouseLeave(setEditButtonStyle)}
              >
                {editMode ? (
                  <>
                    <FontAwesomeIcon icon={faTimes} />
                    Avbryt
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faEdit} />
                    Rediger
                  </>
                )}
              </button>
              {editMode && (
                <button
                  onClick={handleDelete}
                  style={{ ...buttonStyle, ...deleteButtonStyle }}
                  onMouseEnter={() => handleMouseEnter(setDeleteButtonStyle)}
                  onMouseLeave={() => handleMouseLeave(setDeleteButtonStyle)}
                  title="Delete Selected"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              )}
            </>
          )}
        </div>
      )}

      <div style={containerStyle}>
        <div style={sectionStyle}>
          <h3 style={{ ...titleStyle, color: "#40547a", marginBottom: "20px" }}>
            Arrangementer
          </h3>

          <div style={subtitleStyle}>
            <span style={{ flex: 1, textAlign: "left", color: "#40547a" }}>
              Tittel
            </span>
            <span style={{ flex: 1, textAlign: "center", color: "#40547a" }}>
              Beskrivelse
            </span>
            <span style={{ flex: 1, textAlign: "right", color: "#40547a" }}>
              Dato
            </span>
          </div>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {sortedEntries(
              officeScreenContent.filter((entry) => entry.table === "events")
            )
              .slice(0, 4) // Limit to 4 items
              .map((event, index) => renderEntry(event, index))}
          </ul>
        </div>
        <div style={sectionStyle}>
          <h3 style={{ ...titleStyle, color: "#40547a", marginBottom: "20px" }}>
            Majorstuen T-banestasjon
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              color: "#40547a",
            }}
          >
            <span style={{ textAlign: "left" }}>Linje</span>
            <span style={{ textAlign: "right" }}>Avgang</span>
          </div>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <Entur setDepartures={setDepartures} />
            {departures.map((departure, index) =>
              renderDeparture(departure, index)
            )}
          </ul>
        </div>
        <div style={sectionStyle}>
          <h3 style={{ ...titleStyle, color: "#40547a", marginBottom: "20px" }}>
            Kantinemeny
          </h3>
          <div style={subtitleStyle}>
            <span style={{ flex: 1, textAlign: "left", color: "#40547a" }}>
              Dagens rett
            </span>
            <span style={{ flex: 1, textAlign: "right", color: "#40547a" }}>
              Dato
            </span>
          </div>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {sortedEntries(
              officeScreenContent.filter(
                (entry) => entry.table === "canteenMenu"
              )
            )
              .slice(0, 4) // Limit to 4 items
              .map((menu, index) => renderEntry(menu, index))}
          </ul>
        </div>
        <div style={sectionStyle}>
          <h3 style={{ ...titleStyle, color: "#40547a", marginBottom: "20px" }}>
            Beskjeder
          </h3>

          <div style={subtitleStyle}>
            <span
              style={{ flex: 1, textAlign: "left", color: "#40547a" }}
            ></span>
            <span
              style={{ flex: 1, textAlign: "right", color: "#40547a" }}
            ></span>
          </div>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {sortedEntries(
              officeScreenContent.filter((entry) => entry.table === "comments")
            )
              .slice(0, 4) // Limit to 4 items
              .map((comment, index) => renderEntry(comment, index))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OfficeScreen;
