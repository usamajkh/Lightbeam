import React, { useState, useEffect } from "react";
import screenfull from "screenfull";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import Entur from "./Entur"; // Import Entur component
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
  const [fullScreenSection, setFullScreenSection] = useState(false); // State for fullscreen section

  useEffect(() => {
    if (screenfull.isEnabled) {
      const changeHandler = () => {
        setShowButton(!screenfull.isFullscreen);
        toggleLinkVisibility();
        if (!screenfull.isFullscreen) {
          setFullScreenSection(false);
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
        if (fullScreenSection) {
          setFullScreenSection(false);
        } else {
          screenfull.exit();
        }
      }
    };

    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [fullScreenSection]);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      console.log(`Fetched user data for user_id ${userId}:`, response.data); // Debug log
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
    console.log("Unique user IDs to fetch:", uniqueUserIds); // Debug log
    const userData = {};
    for (const userId of uniqueUserIds) {
      userData[userId] = await fetchUserData(userId);
    }
    console.log("Fetched user data:", userData); // Debug log
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
    console.log("Rendering entry:", entry); // Debug log
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
              padding: "10px",
              marginBottom: "0px",
            }}
          >
            <span
              className="content-text"
              style={{ textAlign: "left", flex: 1 }}
            >
              {entry.title || "No Title"}
            </span>
            <span
              className="content-text"
              style={{ textAlign: "center", flex: 1 }}
            >
              {entry.description || "No Description"}
            </span>
            <span
              className="content-text"
              style={{ textAlign: "right", flex: 1, marginRight: "-10px" }}
            >
              {formatDate(entry.date)}
            </span>
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
              padding: "5px",
              marginBottom: "0px",
            }}
          >
            <span
              className="content-text"
              style={{ textAlign: "left", flex: 1 }}
            >
              {menu || "No Menu"}
            </span>
            <span
              className="content-text"
              style={{ textAlign: "right", flex: 1, marginRight: "-5px" }}
            >
              {formatDate(entry.date)}
            </span>
          </div>
        );
        break;
      case "comments":
        console.log("Rendering comment entry:", entry); // Debug log
        content = (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "5px",
              marginBottom: "0px",
            }}
          >
            <span
              className="content-text"
              style={{ textAlign: "left", flex: 1 }}
            >
              {entry.content || "No Comment"}
            </span>
            <span
              className="content-text"
              style={{ textAlign: "right", flex: 1, marginRight: "-2px" }}
            >
              {users[entry.user_id] || "Unknown User"}
            </span>
          </div>
        );
        break;
      default:
        content = (
          <div key={index} className="entry">
            <span className="content-text" style={{ textAlign: "left" }}>
              {entry.comment}
            </span>
          </div>
        );
    }

    return (
      <div
        key={index}
        className="entry-wrapper"
        style={{ display: "flex", alignItems: "center" }}
      >
        {editMode && (
          <input
            type="checkbox"
            checked={selectedItems.includes(entry)}
            onChange={() => toggleSelection(entry)}
            style={{ marginRight: "10px" }}
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
        className="entry content-text"
        style={{
          padding: fullScreenSection ? "30px" : "10px",
          fontSize: fullScreenSection ? "1em" : "1em",
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
          const minScale = 0.4; // Set a minimum scale value to ensure it's not too small
          const scale = Math.max(
            minScale,
            Math.min(
              window.innerWidth / rect.width,
              window.innerHeight / rect.height
            )
          );
          element.style.transformOrigin = "top center";
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
    let sorted;
    if (entries[0]?.table === "comments") {
      // No date filtering for comments
      sorted = entries;
    } else {
      sorted = entries
        .filter((entry) => isFutureOrToday(entry.date))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    console.log("Sorted entries:", sorted); // Debug log
    return sorted;
  };

  //

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
    transition: "all 0.3s ease",
  };

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
    backgroundColor: "white",
    color: "black",
    borderRadius: "15px",
    padding: "20px",
    marginBottom: "0px",
    width: "400px", // Default width
    height: "auto", // Default height
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    marginTop: "35px",
    transition: "all 0.5s ease", // Smooth transition for expansion
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: "30px",
    marginTop: "0px",
    color: "black",
    fontSize: "20px", // Default font size
  };

  const subtitleStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 20px",
    fontWeight: "bold",
    fontSize: "16px", // Default font size
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1420) {
        document.querySelectorAll(".section").forEach((section) => {
          section.style.width = "600px"; // Width for TV screen
          section.style.height = "auto"; // Height for TV screen
        });
        document.querySelectorAll(".title").forEach((title) => {
          title.style.fontSize = "40px"; // Font size for TV screen
        });
        document.querySelectorAll(".subtitle").forEach((subtitle) => {
          subtitle.style.fontSize = "28px"; // Font size for TV screen
        });
        document.querySelectorAll(".content-text").forEach((content) => {
          content.style.fontSize = "1.5em"; // Increase content text size for TV screen
        });
      } else {
        document.querySelectorAll(".section").forEach((section) => {
          section.style.width = "400px"; // Default width
          section.style.height = "auto"; // Default height
        });
        document.querySelectorAll(".title").forEach((title) => {
          title.style.fontSize = "20px"; // Default font size
        });
        document.querySelectorAll(".subtitle").forEach((subtitle) => {
          subtitle.style.fontSize = "16px"; // Default font size
        });
        document.querySelectorAll(".content-text").forEach((content) => {
          content.style.fontSize = "1em"; // Default content text size
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = (setButtonStyle) => {
    setButtonStyle({
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
      transform: "scale(1.05)",
    });
  };

  const handleMouseLeave = (setButtonStyle) => {
    setButtonStyle({
      boxShadow: "none",
      transform: "scale(1)",
    });
  };

  useEffect(() => {
    console.log("OfficeScreen Content: ", officeScreenContent); // Debug log
  }, [officeScreenContent]);

  const handleDoubleClick = () => {
    if (screenfull.isFullscreen) {
      setFullScreenSection(!fullScreenSection);
    }
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
        <div className="section" style={sectionStyle}>
          <h3
            className="title"
            style={{ ...titleStyle, color: "#40547a", marginBottom: "20px" }}
          >
            Arrangementer
          </h3>
          <div className="subtitle" style={subtitleStyle}>
            <span
              style={{
                flex: 1,
                textAlign: "left",
                marginLeft: "-10px",
                color: "#40547a",
              }}
            >
              Tittel
            </span>
            <span style={{ flex: 1, textAlign: "center", color: "#40547a" }}>
              Beskrivelse
            </span>
            <span
              style={{
                flex: 1,
                textAlign: "right",
                marginRight: "-15px",
                color: "#40547a",
              }}
            >
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
        <div
          className="section"
          style={{
            ...sectionStyle,
            ...(fullScreenSection
              ? {
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "90%",
                  height: "90%",
                  zIndex: 1000,
                  overflow: "auto",
                  fontSize: "3em", // Triple the font size
                  padding: "30px", // Triple the padding
                }
              : {}),
          }}
          onDoubleClick={handleDoubleClick}
        >
          <h3
            className="title"
            style={{
              ...titleStyle,
              color: "#40547a",
              marginBottom: "20px",
              fontSize: fullScreenSection ? "40px" : "20px", // Triple the font size
            }}
          >
            Majorstuen T-banestasjon
          </h3>
          <div
            className="subtitle"
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              color: "#40547a",
              fontSize: fullScreenSection ? "32px" : "16px", // Triple the font size
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
        {!fullScreenSection && (
          <>
            <div className="section" style={sectionStyle}>
              <h3
                className="title"
                style={{
                  ...titleStyle,
                  color: "#40547a",
                  marginBottom: "20px",
                }}
              >
                Kantinemeny
              </h3>
              <div className="subtitle" style={subtitleStyle}>
                <span
                  style={{
                    flex: 1,
                    textAlign: "left",
                    marginLeft: "-15px",
                    color: "#40547a",
                  }}
                >
                  Dagens rett
                </span>
                <span
                  style={{
                    flex: 1,
                    textAlign: "right",
                    marginRight: "-15px",
                    color: "#40547a",
                  }}
                >
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
            <div className="section" style={sectionStyle}>
              <h3
                className="title"
                style={{
                  ...titleStyle,
                  color: "#40547a",
                  marginBottom: "20px",
                }}
              >
                Beskjeder
              </h3>

              <div className="subtitle" style={subtitleStyle}>
                <span
                  style={{
                    flex: 1,
                    textAlign: "left",
                    marginLeft: "-15px",
                    color: "#40547a",
                  }}
                >
                  Innhold
                </span>
                <span
                  style={{
                    flex: 1,
                    textAlign: "right",
                    marginRight: "-15px",
                    color: "#40547a",
                  }}
                >
                  Skrevet av{" "}
                </span>
              </div>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {sortedEntries(
                  officeScreenContent.filter(
                    (entry) => entry.table === "comments"
                  )
                )
                  .slice(0, 4) // Limit to 4 items
                  .map((comment, index) => renderEntry(comment, index))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OfficeScreen;
