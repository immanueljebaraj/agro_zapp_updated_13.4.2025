import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

import a from "./assets/a.png";
import b from "./assets/b.png";
import s3 from "./assets/s3.jpg";
import j from "./assets/j.png";
import kit from "./assets/kit.png";

const sensors = [
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
];

const basic = [
  {
    name: "Soil precise farming kit",
    image: j,
    details:
      "Basic Kit (Includes essential sensors and GPS for small-scale farmers)\nSubscription: Basic data visualization and sensor readings",
    price: "₹12,500",
  },
];

const premium = [
  {
    name: "Soil precise farming Premium kit",
    image: kit,
    details:
      "Premium Kit (Adds advanced NDVI/NDMI/GNDVI monitoring, GIS integration, and enhanced data analytics allowing shared access across multiple users).\nSubscription: Advanced analytics including automated fertilizer recommendations, historical trend analysis, detailed crop health reports and custom alerts.",
    price: "₹500",
  },
];

const Miscellaneous = [
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
];

function Payment() {
  const location = useLocation();
  const [purchase, setPurchase] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const alldata = location.state?.alldata || [];
  const [tot, setTot] = useState(0);

  let navigate = useNavigate();

  // Update purchase state based on alldata
  useEffect(() => {
    const newPurchase = [];
    for (let i = 0; i < alldata.length; i++) {
      if (alldata[i] === "Sensors") {
        newPurchase.push(...sensors);
      } else if (alldata[i] === "Basic Kit") {
        newPurchase.push(...basic);
      } else if (alldata[i] === "Premium Kit") {
        newPurchase.push(...premium);
      } else if (alldata[i] === "Miscellaneous") {
        newPurchase.push(...Miscellaneous);
      }
    }
    setPurchase(newPurchase);
  }, [alldata]);

  useEffect(() => {
    let total = 0;
    purchase.forEach((product) => {
      // Remove '₹' and convert price to a number
      const price = Number(product.price.replace("₹", "").replace(",", ""));
      total += price;
    });
    setTot(total); // Update the total amount
  }, [purchase]);

  const filteredProducts = purchase.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click on a product card
  const handleCard = (name) => {
    console.log(`Clicked on: ${name}`);
    // Add navigation or other logic here
  };

  // Handle Next button click
  const handleNext = () => {
    console.log("Next button clicked");
    Navigate("/dashboard");
    // Add logic for the Next button here
  };

  const dashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <div className="app-container-pay">
        <div className="check-pay">
          <div>
            <u>Purchase Devices</u>
          </div>
          <div className="check-options">
            <div className="grid-pay">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <div
                    className="card-pay"
                    key={index}
                    onClick={() => handleCard(product.name)}
                  >
                    <div className="card-pay-2">
                      <div>
                        <div
                          className="card-image-pay"
                          style={{ backgroundImage: `url(${product.image})` }}
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent parent click event
                            handleCard(product.name);
                          }}
                        ></div>
                        <div className="card-name-pay">{product.name}</div>
                      </div>
                      <div className="details">
                        <div className="details">{product.details}</div>
                      </div>
                      <div className="price">{product.price}</div>
                      {/* <div>{total(product.price)}</div> */}
                    </div>
                  </div>
                ))
              ) : (
                <p>No products found.</p> // Handle case when no products are available
              )}
            </div>
          </div>
          <div className="total-amount">₹{tot}</div>
          <div className="button-div-pay">
            <button className="buttons-pay" onClick={dashboard}>
              Pay
            </button>
            {/* <button className='buttona-next' ></button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
