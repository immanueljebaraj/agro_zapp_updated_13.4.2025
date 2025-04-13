import React, { useState } from "react";
import "./Items.css";
import { useLocation, useNavigate } from "react-router-dom";
import a from "./assets/a.png";
import b from "./assets/b.png";
import c from "./assets/c.png";
import d from "./assets/d.png";
import e from "./assets/e.png";
import f from "./assets/f.png";
import g from "./assets/g.png";
import h from "./assets/h.png";
import i from "./assets/i.png";
import j from "./assets/j.png";
import k from "./assets/k.png";
import l from "./assets/l.png";
import m from "./assets/m.png";
import n from "./assets/n.png";

import s3 from "./assets/s3.jpg";
import s4 from "./assets/s4.jpg";
import s5 from "./assets/s5.jpg";
import s6 from "./assets/s6.jpg";
import s7 from "./assets/s7.jpg";
import s8 from "./assets/s8.jpg";
import s9 from "./assets/s9.jpg";
import s10 from "./assets/s10.jpg";
import s11 from "./assets/s11.jpg";
import s12 from "./assets/s12.jpg";
import s13 from "./assets/s13.jpg";
import s14 from "./assets/s14.jpg";

const initialProducts = [
  {
    name: "Soil Moisture Sensor",
    image: a,
    details: "Detects moisture levels in the soil to optimize irrigation.",
    price: "₹500",
  },
  {
    name: "Temperature & Humidity Sensor",
    image: b,
    details: "Monitors environmental conditions for optimal crop growth.",
    price: "₹700",
  },
  {
    name: "Smart Irrigation Kit",
    image: c,
    details: "Automated irrigation system for efficient water usage.",
    price: "₹3,500",
  },
  {
    name: "Hydroponic Farming Kit",
    image: d,
    details: "Complete kit for soil-less farming using hydroponic techniques.",
    price: "₹5,000",
  },
  {
    name: "Weather Monitoring Station",
    image: e,
    details:
      "Tracks temperature, humidity, and rainfall for farming decisions.",
    price: "₹4,000",
  },
  {
    name: "Automated Fertilizer Dispenser",
    image: f,
    details: "Automatically dispenses fertilizers in controlled quantities.",
    price: "₹2,500",
  },
  {
    name: "Greenhouse Control System",
    image: g,
    details: "Maintains optimal temperature and humidity inside a greenhouse.",
    price: "₹7,000",
  },
  {
    name: "Solar-Powered Water Pump",
    image: h,
    details: "Uses solar energy to pump water for irrigation.",
    price: "₹6,500",
  },
  {
    name: "pH & EC Meter",
    image: i,
    details:
      "Measures soil acidity and electrical conductivity for plant health.",
    price: "₹900",
  },
  {
    name: "Multi-Sensor IoT Kit",
    image: j,
    details: "Comprehensive kit with soil, temperature, and humidity sensors.",
    price: "₹8,500",
  },
  {
    name: "Drip Irrigation System",
    image: k,
    details: "Efficient water-saving system for precise irrigation.",
    price: "₹2,000",
  },
  {
    name: "Agricultural Drone",
    image: l,
    details: "Drone for crop monitoring, spraying, and land mapping.",
    price: "₹20,000",
  },
  {
    name: "Miscellaneous Kit (Wires, Buttons, Connectors)",
    image: m,
    details:
      "Essential electrical components for assembling agricultural projects.",
    price: "₹1,200",
  },
  {
    name: "Smart Scanning Camera",
    image: n,
    details:
      "AI-based system for analyzing farm conditions and optimizing yields.",
    price: "₹10,000",
  },
];

const initialSensor = [
  {
    name: "Soil Moisture Sensor",
    image: a,
    details: "Detects moisture levels in the soil to optimize irrigation.",
    price: "₹300",
  },
  {
    name: "Temperature & Humidity Sensor",
    image: b,
    details: "Monitors environmental conditions for optimal crop growth.",
    price: "₹400",
  },
  {
    name: "pH Sensor",
    image: s3,
    details: "Measures soil acidity to ensure proper nutrient absorption.",
    price: "₹500",
  },
  {
    name: "Light Intensity Sensor",
    image: s4,
    details: "Measures light levels to optimize plant growth conditions.",
    price: "₹600",
  },
  {
    name: "CO2 Sensor",
    image: s5,
    details: "Monitors carbon dioxide levels for greenhouse environments.",
    price: "₹1,000",
  },
  {
    name: "Water Level Sensor",
    image: s6,
    details:
      "Detects water levels in tanks or reservoirs for irrigation systems.",
    price: "₹800",
  },
  {
    name: "Nutrient Sensor",
    image: s7,
    details: "Measures nutrient levels in hydroponic or soil-based systems.",
    price: "₹1,500",
  },
  {
    name: "Wind Speed Sensor",
    image: s8,
    details: "Monitors wind speed to protect crops from damage.",
    price: "₹1,000",
  },
  {
    name: "Rainfall Sensor",
    image: s9,
    details: "Detects rainfall to optimize irrigation schedules.",
    price: "₹900",
  },
  {
    name: "Multi-Parameter Soil Sensor",
    image: s10,
    details: "Measures moisture, temperature, and pH levels in soil.",
    price: "₹2,000",
  },
  {
    name: "Air Quality Sensor",
    image: s11,
    details: "Monitors air quality for greenhouse or indoor farming.",
    price: "₹1,800",
  },
  {
    name: "Leaf Wetness Sensor",
    image: s12,
    details: "Detects moisture on leaves to prevent fungal diseases.",
    price: "₹1,200",
  },
  {
    name: "Solar Radiation Sensor",
    image: s13,
    details: "Measures solar radiation to optimize plant growth.",
    price: "₹1,500",
  },
  {
    name: "EC Sensor",
    image: s14,
    details:
      "Measures electrical conductivity in soil or water for nutrient analysis.",
    price: "₹1,000",
  },
];

function Items() {
  let navigate = useNavigate();
  let location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [schools, setSchools] = useState(initialProducts);
  const [products, setProducts] = useState([]);
  const alldata = location.state?.alldata || [];
  console.log(alldata);

  /*for(i=0;i<=alldata.length();i++){
        setProducts((prev)=>[...prev,alldata[i]])
    }*/

  const home = () => {
    navigate("/");
  };
  const about = () => {
    navigate("/about");
  };

  const login = () => {
    navigate("/login");
  };
  const register = () => {
    navigate("/register");
  };

  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCard = (schoolName) => {
    navigate(`/departments/${schoolName}`);
  };

  const data = () => {};
  return (
    <div className="app-item">
      <header>
        <nav class="navbar">
          <div class="logo">🌿 Agro Zapp</div>
          <ul class="nav-links">
            <li>
              <a href="#" onClick={home}>
                Home
              </a>
            </li>
            <li>
              <a href="#" onClick={about}>
                About
              </a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Subscription</a>
            </li>
          </ul>
          <ul class="nav-links">
            <li>
              <a href="#" onClick={login}>
                Login
              </a>
            </li>
            <li>
              <a href="#" onClick={register}>
                Sign Up
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <div class="main-container-items">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search departments..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid">
          {filteredSchools.length > 0 ? (
            filteredSchools.map((school, index) => (
              <div
                className="card-stock"
                key={index}
                onClick={() => handleCard(school.name)}
              >
                <div
                  className="card-image"
                  style={{ backgroundImage: `url(${school.image})` }}
                  onClick={(event) => {
                    event.stopPropagation(); // Prevent parent click event
                    handleCard(school.name);
                  }}
                ></div>
                <div className="card-footer">{school.name}</div>
                <div>{school.details}</div>
                <div>{school.price}</div>
              </div>
            ))
          ) : (
            <p>No schools found.</p> // Handle case when no schools are available
          )}
        </div>
      </div>
    </div>
  );
}

export default Items;


