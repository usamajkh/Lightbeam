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
        console.log("stopPlace data:", result.data.stopPlace);

        if (result.errors) {
          throw new Error(
            `GraphQL error! ${result.errors.map((e) => e.message).join(", ")}`
          );
        }

        setDepartures(result.data.stopPlace.estimatedCalls);
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
    }

    return `${diffMins} min`;
  };

  const closestDepartures = departures.slice(0, 4); // Display 4 closest departures
  const upcomingDepartures = departures.slice(4);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {closestDepartures.map((departure, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px", // Add space between the items
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
        <h2></h2>
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
              <span key={index} style={{ marginRight: "20px" }}>
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
        `}
      </style>
    </div>
  );
};

export default Entur;
