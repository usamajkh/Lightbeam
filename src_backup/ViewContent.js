import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";

const ViewContent = ({ setOfficeScreenContent }) => {
  const [selectedTable, setSelectedTable] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  const [addButtonStyle, setAddButtonStyle] = useState({});
  const [deleteButtonStyle, setDeleteButtonStyle] = useState({});
  const [editButtonStyle, setEditButtonStyle] = useState({});
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const selectRef = useRef(null);

  const tableNames = {
    users: "Brukere",
    comments: "Beskjeder",
    events: "Arrangementer",
    canteenMenu: "Kantinemeny",
  };

  const fetchTableData = async (table) => {
    console.log(`Fetching data from table: ${table}`);
    try {
      const response = await axios.get(`http://localhost:3000/${table}`);
      console.log(`Data fetched from ${table}:`, response.data);
      setTableData(response.data);
    } catch (error) {
      console.error(`Error fetching data from ${table}:`, error);
    }
  };

  const handleTableChange = (e) => {
    console.log(`Table changed to: ${e.target.value}`);
    setSelectedTable(e.target.value);
    setShowButtons(false);
    setSuccessMessage("");
    setEditing(false);
    setSelectedEntries([]); // Reset selected entries
    setEditValues({}); // Reset edit values
    if (e.target.value) {
      fetchTableData(e.target.value);
    } else {
      setTableData([]);
    }
  };

  const handleCheckboxChange = (entry) => {
    console.log(`Checkbox changed for entry:`, entry);
    setSelectedEntries((prevEntries) => {
      if (prevEntries.includes(entry)) {
        return prevEntries.filter((e) => e !== entry);
      } else {
        return [...prevEntries, entry];
      }
    });
  };

  const formatDateForMySQL = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19).replace("T", " ");
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleAddToScreen = async () => {
    console.log("Adding selected entries to screen:", selectedEntries);
    const promises = selectedEntries.map((entry) => {
      return axios.get(`http://localhost:3000/${selectedTable}/${entry.id}`);
    });

    try {
      const results = await Promise.all(promises);
      const entriesData = results.map((result) => ({
        ...result.data,
        table: selectedTable,
      }));

      let addedEntries = [];

      setOfficeScreenContent((prevContent) => {
        const savedContent = localStorage.getItem("officeScreenContent");
        const parsedContent = savedContent ? JSON.parse(savedContent) : [];
        const newContent = [...parsedContent];

        entriesData.forEach((entry) => {
          if (
            !parsedContent.some(
              (existingEntry) =>
                existingEntry.id === entry.id &&
                existingEntry.table === entry.table
            )
          ) {
            newContent.push(entry);
            addedEntries.push(entry);
          }
        });

        console.log("New content to be saved to localStorage:", newContent);
        localStorage.setItem("officeScreenContent", JSON.stringify(newContent));
        return newContent;
      });

      if (addedEntries.length > 0) {
        setSuccessMessage("Lagt til på skjerm");
      } else {
        setSuccessMessage("Finnes allerede på skjermnen.");
      }
    } catch (error) {
      console.error("Error fetching data for selected entries:", error);
      setSuccessMessage("Failed to add to the screen.");
    }
  };

  const handleDeleteSelected = async () => {
    console.log("Deleting selected entries:", selectedEntries);
    const promises = selectedEntries.map((entry) => {
      return axios.delete(`http://localhost:3000/${selectedTable}/${entry.id}`);
    });

    try {
      await Promise.all(promises);
      setSuccessMessage("Slettet fra database");
      fetchTableData(selectedTable);
      setSelectedEntries([]);
    } catch (error) {
      console.error("Error deleting selected entries:", error);
      setSuccessMessage("Failed to delete selected entries.");
    }
  };

  const handleEdit = () => {
    console.log("Entering edit mode with selected entries:", selectedEntries);
    setEditing(true);
    const initialEditValues = selectedEntries.reduce((acc, entry) => {
      acc[entry.id] = { ...entry };
      return acc;
    }, {});
    setEditValues(initialEditValues);
    console.log("Initial edit values:", initialEditValues);
  };

  const handleSave = async () => {
    console.log("Saving edited entries:", editValues);

    const formattedEditValues = Object.values(editValues).map((entry) => {
      if (entry.date) {
        entry.date = formatDateForMySQL(entry.date);
      }
      if (entry.birthdate) {
        entry.birthdate = formatDateForMySQL(entry.birthdate);
      }
      if (entry.created_at) {
        entry.created_at = formatDateForMySQL(entry.created_at);
      }
      return entry;
    });

    console.log("Formatted edited entries:", formattedEditValues);

    const promises = formattedEditValues.map((entry) => {
      console.log(`Updating entry with ID ${entry.id}`, entry); // Debug log
      const { id, user_id, ...editableFields } = entry; // Exclude id and user_id from editable fields
      return axios
        .put(
          `http://localhost:3000/${selectedTable}/${entry.id}`,
          editableFields,
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((response) => {
          console.log("Response:", response);
          // Update localStorage
          setOfficeScreenContent((prevContent) => {
            const savedContent = localStorage.getItem("officeScreenContent");
            const parsedContent = savedContent ? JSON.parse(savedContent) : [];
            const updatedContent = parsedContent.map((item) => {
              if (item.id === entry.id && item.table === selectedTable) {
                return { ...item, ...editableFields };
              }
              return item;
            });
            localStorage.setItem(
              "officeScreenContent",
              JSON.stringify(updatedContent)
            );
            return updatedContent;
          });
        })
        .catch((error) => {
          console.error(
            "Error:",
            error.response ? error.response.data : error.message
          );
        });
    });

    try {
      await Promise.all(promises);
      setSuccessMessage("Oppdatering vellykket");
      setEditing(false);
      fetchTableData(selectedTable);
      setSelectedEntries([]);
      setEditValues({});
    } catch (error) {
      console.error("Error updating selected entries:", error);
      console.error("Server response:", error.response); // Additional log
      setSuccessMessage("Failed to update selected entries.");
    }
  };

  useEffect(() => {
    setShowButtons(selectedTable !== "");
    console.log("Selected table:", selectedTable);

    const longestOptionTextWidth = Math.max(
      ...Array.from(selectRef.current.options).map(
        (option) => option.text.length * 8
      )
    );
    selectRef.current.style.width = `${longestOptionTextWidth + 40}px`;
  }, [selectedTable]);

  const buttonStyle = {
    backgroundColor: "rgba(227, 213, 202, 0.2)",
    color: "black",
    border: "none",
    borderRadius: "4px",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "20px",
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

  const handleEditChange = (id, key, value) => {
    console.log(`Editing value for entry ${id} - ${key}: ${value}`);
    setEditValues((prevValues) => ({
      ...prevValues,
      [id]: {
        ...prevValues[id],
        [key]: value,
      },
    }));
  };

  return (
    <div>
      <h1>Legg til innhold som skal vises på skjermen</h1>
      <label htmlFor="table-select"></label>
      <select
        id="table-select"
        ref={selectRef}
        value={selectedTable}
        onChange={handleTableChange}
      >
        <option value="">Velg innhold...</option>
        <option value="users">Brukere</option>
        <option value="comments">Beskjeder</option>
        <option value="events">Arrangementer</option>
        <option value="canteenMenu">Kantinemeny</option>
      </select>
      <div>
        <h2 style={{ marginBottom: "20px" }}>
          Innhold fra {tableNames[selectedTable] || ""}
        </h2>
        {tableData.length > 0 && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                <th>Select</th>
                {Object.keys(tableData[0]).map(
                  (key) =>
                    key !== "picture" && (
                      <th key={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </th>
                    )
                )}
              </tr>
            </thead>
            <tbody>
              {tableData.map((entry, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? "rgba(227, 213, 202, 0.2)" : "#3b4d70",
                    color: index % 2 === 0 ? "black" : "white",
                  }}
                >
                  <td>
                    <input
                      type="checkbox"
                      id={`checkbox-${index}`}
                      name={`checkbox-${index}`}
                      checked={selectedEntries.includes(entry)}
                      onChange={() => handleCheckboxChange(entry)}
                    />
                  </td>
                  {Object.keys(tableData[0]).map(
                    (key) =>
                      key !== "picture" && (
                        <td key={key}>
                          {editing && selectedEntries.includes(entry) ? (
                            <input
                              type="text"
                              value={editValues[entry.id]?.[key] ?? entry[key]}
                              onChange={(e) =>
                                handleEditChange(entry.id, key, e.target.value)
                              }
                              disabled={key === "id" || key === "user_id"}
                            />
                          ) : key === "date" || key === "birthdate" ? (
                            formatDate(entry[key])
                          ) : (
                            entry[key]
                          )}
                        </td>
                      )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showButtons && (
        <>
          {selectedTable !== "users" && (
            <button
              onClick={handleAddToScreen}
              style={{ ...buttonStyle, ...addButtonStyle }}
              onMouseEnter={() => handleMouseEnter(setAddButtonStyle)}
              onMouseLeave={() => handleMouseLeave(setAddButtonStyle)}
              disabled={selectedEntries.length === 0} // Disable if no entries selected
            >
              Legg til skjerm
            </button>
          )}
          <button
            onClick={handleDeleteSelected}
            style={{ ...buttonStyle, ...deleteButtonStyle }}
            onMouseEnter={() => handleMouseEnter(setDeleteButtonStyle)}
            onMouseLeave={() => handleMouseLeave(setDeleteButtonStyle)}
            disabled={selectedEntries.length === 0} // Disable if no entries selected
          >
            Slett
          </button>
          {!editing ? (
            <button
              onClick={handleEdit}
              style={{ ...buttonStyle, ...editButtonStyle }}
              onMouseEnter={() => handleMouseEnter(setEditButtonStyle)}
              onMouseLeave={() => handleMouseLeave(setEditButtonStyle)}
              disabled={selectedEntries.length === 0} // Disable if no entries selected
            >
              Rediger
            </button>
          ) : (
            <button
              onClick={handleSave}
              style={{ ...buttonStyle, ...editButtonStyle }}
              onMouseEnter={() => handleMouseEnter(setEditButtonStyle)}
              onMouseLeave={() => handleMouseLeave(setEditButtonStyle)}
            >
              Save
            </button>
          )}
        </>
      )}
      {successMessage && (
        <div
          style={{
            backgroundColor: "rgba(227, 213, 202, 0.2)",
            color: "black",
            border: "1px solid #c3e6cb",
            borderRadius: "4px",
            padding: "10px",
            marginTop: "20px",
            fontSize: "16px",
            fontWeight: "bold",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
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

export default ViewContent;
