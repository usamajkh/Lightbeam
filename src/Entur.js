import React, { useEffect, useState } from "react";

const Entur = () => {
  const [departures, setDepartures] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartures = async () => {
      const query = `
        {
          stopPlace(id: "NSR:StopPlace:58381") {
            name
            estimatedCalls(timeRange: 72100, numberOfDepartures: 20, whiteListedModes: [metro]) {
              realtime
              aimedArrivalTime
              expectedArrivalTime
              destinationDisplay {
                frontText
              }
              serviceJourney {
                journeyPattern {
                  line {
                    publicCode
                    name
                  }
                }
              }
            }
          }
        }
      `;

      try {
        console.log("Fetching data...");
        const response = await fetch(
          "https://api.entur.io/journey-planner/v2/graphql",
          {
            method: "POST",
            headers: {
              "ET-Client-Name": "your-app-name", // Replace with your app name
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Fetch result:", result);

        if (result.errors) {
          throw new Error(
            `GraphQL error! ${result.errors.map((e) => e.message).join(", ")}`
          );
        }

        if (!result.data || !result.data.stopPlace) {
          throw new Error("No stopPlace data found in the response.");
        }

        const filteredDepartures = result.data.stopPlace.estimatedCalls.filter(
          (call) =>
            ["1", "2", "3", "4", "5"].includes(
              call.serviceJourney.journeyPattern.line.publicCode
            )
        );

        setDepartures(filteredDepartures);
      } catch (err) {
        setError(err.message);
        console.error("Fetching error: ", err);
      }
    };

    fetchDepartures();
    const interval = setInterval(fetchDepartures, 60000); // Fetch data every 60 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const formatTimeDifference = (time) => {
    const now = new Date();
    const departureTime = new Date(time);
    const diffMs = departureTime - now;
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins <= 0) {
      return "Nå";
    } else if (diffMins > 14) {
      return departureTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return `${diffMins} min`;
  };

  const closestDepartures = departures.slice(0, 4); // Display 4 closest departures
  const upcomingDepartures = departures.slice(4);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="content-text" style={{ marginBottom: "20px" }}>
        {closestDepartures.map((departure, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px", // Add space between the items
              padding: "10px",
              backgroundColor: "#242f45",
              color: "white",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            <div style={{ textAlign: "left" }}>
              {departure.serviceJourney.journeyPattern.line.publicCode}{" "}
              {departure.destinationDisplay.frontText}:
            </div>
            <div style={{ textAlign: "right" }}>
              {formatTimeDifference(departure.expectedArrivalTime)}
            </div>
          </div>
        ))}
      </div>
      <div>
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "inline-block",
              paddingLeft: "100%",
              animation: "marquee 60s linear infinite", // Adjust the duration to slow down the speed
            }}
          >
            {upcomingDepartures.map((departure, index) => (
              <span
                key={index}
                style={{
                  marginRight: "20px",
                  padding: "5px",
                  backgroundColor: "#242f45",
                  color: "white",
                  borderRadius: "5px",
                }}
              >
                {departure.serviceJourney.journeyPattern.line.publicCode}{" "}
                {departure.destinationDisplay.frontText}:{" "}
                {formatTimeDifference(departure.expectedArrivalTime)}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes marquee {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(-100%, 0);
            }
          }
          @media (min-width: 1420px) {
            .content-text {
              font-size: 1.5em;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Entur;
