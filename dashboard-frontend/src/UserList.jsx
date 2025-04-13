import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "./profile.jpg";
import "./UserList.css";

const initialUsers = [
  {
    name: "Ravi Kumar",
    age: 28,
    category: "Basic",
    Experience: "2 years",
    charge: "₹80/day",
    contact: "+91 98765 43210",
    address: "Gachibowli, Hyderabad",
  },
  {
    name: "Priya Sharma",
    age: 25,
    category: "Basic",
    Experience: "1.5 years",
    charge: "₹70/day",
    contact: "+91 87654 32109",
    address: "Kondapur, Hyderabad",
  },
  {
    name: "Anil Reddy",
    age: 30,
    category: "Basic",
    Experience: "3 years",
    charge: "₹100/day",
    contact: "+91 76543 21098",
    address: "Madhapur, Hyderabad",
  },
  {
    name: "Sneha Gupta",
    age: 27,
    category: "Basic",
    Experience: "2 years",
    charge: "₹90/day",
    contact: "+91 65432 10987",
    address: "Hitech City, Hyderabad",
  },
  {
    name: "Kiran Patel",
    age: 29,
    category: "Basic",
    Experience: "2.5 years",
    charge: "₹85/day",
    contact: "+91 54321 09876",
    address: "Jubilee Hills, Hyderabad",
  },
  {
    name: "Manoj Singh",
    age: 26,
    category: "Basic",
    Experience: "1 year",
    charge: "₹50/day",
    contact: "+91 43210 98765",
    address: "Banjara Hills, Hyderabad",
  },
  {
    name: "Swati Rao",
    age: 24,
    category: "Basic",
    Experience: "1 year",
    charge: "₹60/day",
    contact: "+91 32109 87654",
    address: "Secunderabad, Hyderabad",
  },
  {
    name: "Vikram Mehta",
    age: 31,
    category: "Basic",
    Experience: "4 years",
    charge: "₹100/day",
    contact: "+91 21098 76543",
    address: "Kukatpally, Hyderabad",
  },
  {
    name: "Neha Joshi",
    age: 23,
    category: "Basic",
    Experience: "1 year",
    charge: "₹40/day",
    contact: "+91 10987 65432",
    address: "Lingampally, Hyderabad",
  },
  {
    name: "Arun Malhotra",
    age: 32,
    category: "Basic",
    Experience: "5 years",
    charge: "₹100/day",
    contact: "+91 09876 54321",
    address: "Begumpet, Hyderabad",
  },
];

function UserList() {
  let navigate = useNavigate();

  const dashboard = () => {
    navigate("/dashboard");
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [schools, setSchools] = useState(initialUsers);

  const handleCard = (schoolName) => {
    // navigate(`/departments/${schoolName}`);
  };

  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <header className="header-user">
        <div>Nearby Device Users</div>
      </header>

      <div>
        <div className="search-bar-user">
          <input
            type="text"
            placeholder="Search departments..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid-user">
          <div className="head-user">
            <div className="name-title">User Name</div>
            <div className="name-detail">Address</div>
            <div className="name-detail">Category</div>
            <div className="name-detail">Experience</div>
            <div className="name-detail">Charge/Rent</div>
            <div className="name-detail">Contact</div>
          </div>
          {filteredSchools.length > 0 ? (
            filteredSchools.map((school, index) => (
              <div
                className="card-user"
                key={index}
                onClick={() => handleCard(school.name)}
              >
                <div className="card-name">
                  <div
                    className="card-image-user"
                    style={{ backgroundImage: `url(${image})` }}
                    onClick={(event) => {
                      event.stopPropagation(); // Prevent parent click event
                      handleCard(school.name);
                    }}
                  ></div>
                  <div>
                    <div className="name-user">{school.name}</div>
                    <div>age:{school.age}</div>
                  </div>
                </div>
                <div>{school.address}</div>
                <div>{school.category}</div>
                <div>{school.Experience}</div>
                <div>{school.charge}</div>
                <div>{school.contact}</div>
              </div>
            ))
          ) : (
            <p>No schools found.</p> // Handle case when no schools are available
          )}
        </div>
      </div>
      <button onClick={dashboard} className="nxt-btn">
        Next
      </button>
    </div>
  );
}

export default UserList;
