import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import DynamicForm from "./DynamicForm";
import ViewContent from "./ViewContent";
import OfficeScreen from "./OfficeScreen";

import Home from "./Home";

import screenfull from "screenfull";
import "./index.css";

const App = () => {
  const [officeScreenContent, setOfficeScreenContent] = useState([]);
  const [showLinks, setShowLinks] = useState(true); // State to control link visibility

  useEffect(() => {
    const savedContent = localStorage.getItem("officeScreenContent");
    if (savedContent) {
      setOfficeScreenContent(JSON.parse(savedContent));
    }
  }, []);

  useEffect(() => {
    if (officeScreenContent.length !== 0) {
      localStorage.setItem(
        "officeScreenContent",
        JSON.stringify(officeScreenContent)
      );
    }
  }, [officeScreenContent]);

  const handleDeleteItems = (entries) => {
    const updatedContent = officeScreenContent.filter(
      (item) =>
        !entries.some(
          (entry) => item.id === entry.id && item.table === entry.table
        )
    );
    setOfficeScreenContent(updatedContent);
    localStorage.setItem("officeScreenContent", JSON.stringify(updatedContent));
  };

  const toggleLinkVisibility = () => {
    setShowLinks(!showLinks);
  };

  return (
    <Router>
      <div>
        <nav
          style={{
            backgroundColor: "#242f45",
            padding: "20px 40px",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
            zIndex: 1000,
            color: "white", // Make navbar items white
          }}
        >
          <div
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Lightbeam
          </div>{" "}
          {/* Make logo white */}
          <ul
            style={{
              listStyleType: "none",
              display: "flex",
              gap: "10px",
              visibility: showLinks ? "visible" : "hidden",
              margin: 0,
              padding: 0,
            }}
          >
            <li>
              <NavLink
                to="/"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "rgba(227, 213, 202, 1.0)" : "white",
                })} // Make navbar items white
              >
                Hjem
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/add"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "rgba(227, 213, 202, 1.0)" : "white",
                })} // Make navbar items white
              >
                Legg til i database
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/view"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "rgba(227, 213, 202, 1.0)" : "white",
                })} // Make navbar items white
              >
                Legg til på skjerm
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/office-screen"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "rgba(227, 213, 202, 1.0)" : "white",
                })} // Make navbar items white
              >
                Skjerm
              </NavLink>
            </li>
            <li></li>
            <li></li>
          </ul>
        </nav>

        <div style={{ paddingTop: "80px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<DynamicForm />} />
            <Route
              path="/view"
              element={
                <ViewContent setOfficeScreenContent={setOfficeScreenContent} />
              }
            />
            <Route
              path="/office-screen"
              element={
                <OfficeScreen
                  officeScreenContent={officeScreenContent}
                  handleDeleteItems={handleDeleteItems}
                  toggleLinkVisibility={toggleLinkVisibility} // Pass the toggle function
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
