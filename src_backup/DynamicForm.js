import React, { useState } from "react";
import axios from "axios";
import "./index.css";

const DynamicForm = () => {
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: "rgba(227, 213, 202, 0.2)",
    color: "black",
    border: "none",
    borderRadius: "4px",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "20px",
    transition: "background-color 0.3s, color 0.3s",
  });

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setFormData({});
    setSuccessMessage(""); // Clear the message when type changes
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint;
      switch (selectedType) {
        case "user":
          endpoint = "/users";
          break;
        case "comment":
          endpoint = "/comments";
          break;
        case "event":
          endpoint = "/events";
          break;
        case "canteen_menu":
          endpoint = "/canteenMenu";
          break;
        default:
          return;
      }
      const response = await axios.post(
        `http://localhost:3000${endpoint}`,
        formData
      );
      console.log("Response data:", response.data); // Log the response data to check its structure

      const timestamp = new Date().toLocaleTimeString();
      if (selectedType === "user") {
        setSuccessMessage(
          `Bruker lagt til med brukerID: ${response.data.userId} (${timestamp})`
        );
      } else {
        setSuccessMessage(`Lagt til (${timestamp})`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSuccessMessage("Failed to add.");
    }
  };

  const containerStyle = {
    width: "300px",
    margin: "0 auto",
    textAlign: "center",
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "8px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  };

  const handleMouseEnter = () => {
    setButtonStyle((prevStyle) => ({
      ...prevStyle,
      backgroundColor: "#242f45",
      color: "white",
    }));
  };

  const handleMouseLeave = () => {
    setButtonStyle((prevStyle) => ({
      ...prevStyle,
      backgroundColor: "rgba(227, 213, 202, 0.2)",
      color: "black",
    }));
  };

  const getOptionLabel = (type) => {
    switch (type) {
      case "user":
        return "Bruker";
      case "comment":
        return "Beskjed";
      case "event":
        return "Arrangement";
      case "canteen_menu":
        return "Kantinemeny";
      default:
        return "Legg til";
    }
  };

  return (
    <div
      style={{
        width: "300px",
        margin: "0 auto",
        textAlign: "center",
        zoom: "90%",
      }}
    >
      <form onSubmit={handleSubmit}>
        <label>
          <h2 style={{ marginBottom: "45px" }}>Velg type innhold</h2>

          <select
            value={selectedType}
            onChange={handleTypeChange}
            style={inputStyle}
          >
            <option value="">Velg innhold...</option>
            <option value="user">Bruker</option>
            <option value="comment">Beskjed</option>
            <option value="event">Arrangement</option>
            <option value="canteen_menu">Kantinemeny</option>
          </select>
        </label>
        {selectedType && (
          <div>
            {selectedType === "user" && (
              <>
                <label>
                  Navn:
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </label>
                <label>
                  Epost:
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </label>
                <label>
                  Fødselsdato:
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate || ""}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </label>
              </>
            )}
            {selectedType === "comment" && (
              <>
                <label>
                  Innhold:
                  <input
                    type="text"
                    name="content"
                    value={formData.content || ""}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </label>
                <label>
                  BrukerID:
                  <input
                    type="number"
                    name="user_id"
                    value={formData.user_id || ""}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </label>
              </>
            )}
            {selectedType === "event" && (
              <>
                <label>
                  Tittel:
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </label>
                <label>
                  Dato:
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </label>
                <label>
                  Beskrivelse:
                  <input
                    type="text"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </label>
                <label>
                  Opprettet av (BrukerID):
                  <input
                    type="number"
                    name="created_by"
                    value={formData.created_by || ""}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </label>
              </>
            )}
            {selectedType === "canteen_menu" && (
              <>
                <label>
                  Dato:
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </label>
                <label>
                  Meny:
                  <input
                    type="text"
                    name="menu"
                    value={formData.menu || ""}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </label>
              </>
            )}
            <button
              type="submit"
              style={buttonStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Legg til {getOptionLabel(selectedType)}
            </button>
          </div>
        )}
      </form>
      {successMessage && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(227, 213, 202, 0.2)",
            color: "black", // Change font color to black
            border: "1px solid #c3e6cb",
            borderRadius: "4px",
            padding: "10px",
            marginTop: "20px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          <span style={{ marginRight: "10px", fontSize: "20px" }}>
            &#10003;
          </span>
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
