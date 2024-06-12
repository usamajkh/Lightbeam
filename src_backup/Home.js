import React, { useRef } from "react";
import homeImage from "./images/home-image.png"; // Import the home image
import howToImage2 from "./images/HowTo-2.png";
import howToImage1 from "./images/HowTo-1.png";
import howToImage3 from "./images/HowTo-3.png";
import howToImage4 from "./images/HowTo-4.png";
import howToImage5 from "./images/HowTo-5.png";
import "./index.css";
import arrowDownIcon from "./images/arrowndown.png";

const Home = () => {
  const nextSectionRef = useRef(null);
  const finalSectionRef = useRef(null);
  const newSectionRef = useRef(null);
  const sectionNewRef = useRef(null);
  const additionalSectionRef = useRef(null);

  const handleScrollDown = () => {
    if (nextSectionRef.current) {
      nextSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollDownFinal = () => {
    if (finalSectionRef.current) {
      finalSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollDownNew = () => {
    if (newSectionRef.current) {
      newSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollDownSectionNew = () => {
    if (sectionNewRef.current) {
      sectionNewRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollDownAdditional = () => {
    if (additionalSectionRef.current) {
      additionalSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column", // Align items vertically
          justifyContent: "center", // Center vertically
          alignItems: "center", // Center horizontally
          height: "80vh",
          paddingLeft: "20px",
          paddingRight: "20px",
          marginTop: "50px", // Add top margin here
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Center text horizontally
            textAlign: "center",
            marginRight: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              color: "black",
              marginBottom: "20px",
              marginTop: "0",
            }}
          >
            Enkel og effektiv informasjonvisning
          </h1>

          <h2
            style={{
              fontSize: "20px",
              fontWeight: "normal",
              color: "gray",
              marginTop: "0",
            }}
          >
            Sanntidsinformasjon på jobben. Tilpass innholdet med noen få enkle
            trinn.
          </h2>
        </div>

        <img
          src={homeImage}
          alt="Home"
          style={{
            width: "350px",
            height: "auto",
            boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.5)", // Drop shadow definition
            marginTop: "20px", // Add some margin to the top of the image
          }}
        />

        <div
          onClick={handleScrollDown}
          style={{
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          <img
            src={arrowDownIcon}
            alt="Arrow Down"
            style={{ width: "50px", height: "50px", color: "gray" }}
          />
        </div>
      </div>

      <div
        ref={nextSectionRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(227, 213, 202, 0.2)",
          padding: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "black",
            textAlign: "center",
            marginBottom: "20px", // Margin to separate the texts
          }}
        >
          Slik kommer du i gang
        </h2>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "normal",
            color: "black",
            textAlign: "center",
            maxWidth: "600px", // Limit the width for better readability
          }}
        >
          Naviger til "Legg til i database" og velg hva slags type innhold du
          vil legge til i databasen. Fint å starte med en "User" da det trengs
          for å legge til annet type innhold.
        </p>

        <img
          src={howToImage1}
          alt="Add Data"
          style={{
            width: "500px",
            height: "auto",
            marginTop: "20px", // Add some margin to the top of the image
          }}
        />

        <div
          onClick={handleScrollDownFinal}
          style={{
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          <img
            src={arrowDownIcon}
            alt="Arrow Down"
            style={{ width: "50px", height: "50px", color: "gray" }}
          />
        </div>
      </div>

      <div
        ref={finalSectionRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "black",
            textAlign: "center",
            marginBottom: "20px", // Margin to separate the texts
          }}
        >
          Legg til på skjerm
        </h2>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "normal",
            color: "black",
            textAlign: "center",
            maxWidth: "600px", // Limit the width for better readability
          }}
        >
          Naviger så til "Legg til på skjerm" og velg type innhold du ønsker å
          vise på skjermen din, huk av og trykk på "Legg til skjerm" knappen.
        </p>

        <img
          src={howToImage2}
          alt="Add Data"
          style={{
            width: "500px",
            height: "auto",
            marginTop: "20px", // Add some margin to the top of the image
          }}
        />

        <div
          onClick={handleScrollDownNew}
          style={{
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          <img
            src={arrowDownIcon}
            alt="Arrow Down"
            style={{ width: "50px", height: "50px", color: "gray" }}
          />
        </div>
      </div>

      <div
        ref={newSectionRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "rgba(227, 213, 202, 0.2)",
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "black",
            textAlign: "center",
            marginBottom: "20px", // Margin to separate the texts
          }}
        >
          Se på innholdet du la til
        </h2>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "normal",
            color: "black",
            textAlign: "center",
            maxWidth: "600px", // Limit the width for better readability
          }}
        >
          Trykk på "Skjerm" for å se innholdet du har lagt til.
        </p>

        <img
          src={howToImage3}
          alt="Add Data"
          style={{
            width: "500px",
            height: "auto",
            marginTop: "20px", // Add some margin to the top of the image
          }}
        />

        <div
          onClick={handleScrollDownSectionNew}
          style={{
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          <img
            src={arrowDownIcon}
            alt="Arrow Down"
            style={{ width: "50px", height: "50px", color: "gray" }}
          />
        </div>
      </div>

      <div
        ref={sectionNewRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "black",
            textAlign: "center",
            marginBottom: "20px", // Margin to separate the texts
          }}
        >
          Rediger skjerminnhold
        </h2>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "normal",
            color: "black",
            textAlign: "center",
            maxWidth: "600px", // Limit the width for better readability
          }}
        >
          Fjern innhold fra skjermen ved å trykke på "Rediger" knappen øverst i
          høyre. Huk av for innholdet du vil fjerne og trykk på søppelbøtte
          ikonet.
        </p>

        <img
          src={howToImage4}
          alt="Final Data"
          style={{
            width: "500px",
            height: "auto",
            marginTop: "20px", // Add some margin to the top of the image
          }}
        />

        <div
          onClick={handleScrollDownAdditional}
          style={{
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          <img
            src={arrowDownIcon}
            alt="Arrow Down"
            style={{ width: "50px", height: "50px", color: "gray" }}
          />
        </div>
      </div>

      <div
        ref={additionalSectionRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(227, 213, 202, 0.2)",
          padding: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "black",
            textAlign: "center",
            marginBottom: "20px", // Margin to separate the texts
          }}
        >
          Visningsmodus
        </h2>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "normal",
            color: "black",
            textAlign: "center",
            maxWidth: "600px", // Limit the width for better readability
          }}
        >
          Trykk på "Fullskjerm" i høyre hjørne for å gå i visningsmodus. Trykk
          "Esc" for å gå ut av visningsmodus.
        </p>

        <img
          src={howToImage5}
          alt="Add Data"
          style={{
            width: "500px",
            height: "auto",
            marginTop: "20px", // Add some margin to the top of the image
          }}
        />

        <div
          onClick={handleScrollDownAdditional}
          style={{
            cursor: "pointer",
            marginTop: "20px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Home;
