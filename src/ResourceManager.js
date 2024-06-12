// src/components/ResourceManager.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const ResourceManager = () => {
  const [selectedResource, setSelectedResource] = useState("");
  const [action, setAction] = useState("");
  const [formData, setFormData] = useState({});
  const [id, setId] = useState("");
  const [existingData, setExistingData] = useState(null);

  const resources = ["event", "meetings", "canteen_menu", "users", "comments"];

  useEffect(() => {
    if (id && action === "edit") {
      fetchExistingData();
    }
  }, [id]);

  const fetchExistingData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/${selectedResource}/${id}`
      );
      setExistingData(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching existing data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (action === "create") {
        await axios.post(`http://localhost:3000/${selectedResource}`, formData);
      } else if (action === "edit") {
        await axios.put(
          `http://localhost:3000/${selectedResource}/${id}`,
          formData
        );
      }
      alert("Success");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error");
    }
  };

  const renderFormFields = () => {
    switch (selectedResource) {
      case "event":
        return (
          <>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title || ""}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date || ""}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description || ""}
              onChange={handleInputChange}
              required
            ></textarea>
            <input
              type="number"
              name="created_by"
              placeholder="Created By (User ID)"
              value={formData.created_by || ""}
              onChange={handleInputChange}
              required
            />
          </>
        );
      case "meetings":
        return (
          <>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title || ""}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date || ""}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="agenda"
              placeholder="Agenda"
              value={formData.agenda || ""}
              onChange={handleInputChange}
              required
            ></textarea>
            <input
              type="number"
              name="created_by"
              placeholder="Created By (User ID)"
              value={formData.created_by || ""}
              onChange={handleInputChange}
              required
            />
          </>
        );
      case "canteen_menu":
        return (
          <>
            <input
              type="date"
              name="date"
              value={formData.date || ""}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="menu"
              placeholder="Menu"
              value={formData.menu || ""}
              onChange={handleInputChange}
              required
            ></textarea>
          </>
        );
      case "users":
        return (
          <>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name || ""}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email || ""}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate || ""}
              onChange={handleInputChange}
              required
            />
          </>
        );
      case "comments":
        return (
          <>
            <textarea
              name="content"
              placeholder="Content"
              value={formData.content || ""}
              onChange={handleInputChange}
              required
            ></textarea>
            <input
              type="number"
              name="user_id"
              placeholder="User ID"
              value={formData.user_id || ""}
              onChange={handleInputChange}
              required
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Resource Manager</h1>
      <div>
        <label>Select Resource: </label>
        <select
          value={selectedResource}
          onChange={(e) => setSelectedResource(e.target.value)}
        >
          <option value="">--Select--</option>
          {resources.map((resource) => (
            <option key={resource} value={resource}>
              {resource}
            </option>
          ))}
        </select>
      </div>

      {selectedResource && (
        <div>
          <div>
            <label>Action: </label>
            <select value={action} onChange={(e) => setAction(e.target.value)}>
              <option value="">--Select--</option>
              <option value="create">Create New</option>
              <option value="edit">Edit Existing</option>
            </select>
          </div>

          {action === "edit" && (
            <div>
              <label>Enter ID to Edit: </label>
              <input
                type="number"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              <button onClick={fetchExistingData}>Fetch Data</button>
            </div>
          )}

          {action && (
            <form onSubmit={handleSubmit}>
              {renderFormFields()}
              <button type="submit">
                {action === "create" ? "Create" : "Update"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceManager;
