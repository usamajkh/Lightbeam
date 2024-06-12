import React, { useState } from "react";
import axios from "axios";
import "./index.css";

const DeleteFromDatabase = () => {
  const [selectedTable, setSelectedTable] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedEntries, setSelectedEntries] = useState([]);

  const fetchTableData = async (table) => {
    try {
      const response = await axios.get(`http://localhost:3000/${table}`);
      setTableData(response.data);
    } catch (error) {
      console.error(`Error fetching data from ${table}:`, error);
    }
  };

  const handleTableChange = (e) => {
    setSelectedTable(e.target.value);
    if (e.target.value) {
      fetchTableData(e.target.value);
    } else {
      setTableData([]);
    }
  };

  const handleCheckboxChange = (entry) => {
    setSelectedEntries((prevEntries) => {
      if (prevEntries.some((e) => e.id === entry.id)) {
        return prevEntries.filter((e) => e.id !== entry.id);
      } else {
        return [...prevEntries, entry];
      }
    });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeleteSelected = async () => {
    console.log("Selected entries to delete:", selectedEntries);
    const promises = selectedEntries.map((entry) =>
      axios.delete(`http://localhost:3000/${selectedTable}/${entry.id}`)
    );

    try {
      await Promise.all(promises);
      alert("Selected entries have been successfully deleted.");
      fetchTableData(selectedTable); // Refetch data to update UI
      setSelectedEntries([]); // Clear selection after deletion
    } catch (error) {
      console.error("Error deleting selected entries:", error);
    }
  };

  return (
    <div>
      <h1>Delete Content from Database</h1>
      <label htmlFor="table-select">Select Table:</label>
      <select
        id="table-select"
        value={selectedTable}
        onChange={handleTableChange}
      >
        <option value="">Select...</option>
        <option value="users">Users</option>
        <option value="comments">Comments</option>
        <option value="events">Events</option>
        <option value="canteenMenu">Canteen Menu</option>
        <option value="meetings">Meetings</option>
      </select>
      <div>
        <h2 style={{ marginBottom: "20px" }}>Content from {selectedTable}</h2>
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
                {Object.keys(tableData[0]).map((key) => (
                  <th key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((entry, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor:
                      index % 2 === 0
                        ? "rgba(227, 213, 202, 0.2)"
                        : "transparent",
                  }}
                >
                  <td>
                    <input
                      type="checkbox"
                      id={`checkbox-${index}`}
                      name={`checkbox-${index}`}
                      checked={selectedEntries.some((e) => e.id === entry.id)}
                      onChange={() => handleCheckboxChange(entry)}
                    />
                  </td>
                  {Object.keys(tableData[0]).map((key) => (
                    <td key={key}>
                      {entry[key] !== undefined
                        ? key === "date" || key === "birthdate"
                          ? formatDate(entry[key])
                          : entry[key]
                        : "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <button
        onClick={handleDeleteSelected}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "rgba(227, 213, 202, 0.2)",
          color: "black",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Delete Selected
      </button>
    </div>
  );
};

export default DeleteFromDatabase;
