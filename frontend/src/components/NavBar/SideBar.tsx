// SideBar.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './SideBar.css'; // Import the CSS file

const SideBar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [formComplete, setFormComplete] = useState<boolean>(false); // New state for form completion

  // these are the various sections we have in the sidebar!
  const sections: { [key: string]: string } = {
    "Overview": "/Overview",
    "General Information": "/General-Information",
    "Demographic Questions": "/Demographic-Questions",
    "Choose Role(s)": "/Choose-Role(s)",
    "Submit": "/Submit"
  };

  // these are the various roles (sub-sections) we have in the sidebar!
  const roleSections: { [key: string]: string } = {
    "Bootcamp": "/Bootcamp",
    "Sourcing": "/Sourcing",
    "Product Manager": "/Product-Manager",
    "UX/Design": "/UX-Design",
    "Engineer": "/Engineer",
    "Tech Lead": "/Tech-Lead"
  };

  // this function handles the click of a section
  const handleSectionClick = (section: string) => {
    setActiveItem(section);
    if (section === "Choose Role(s)") {
      setIsExpanded(!isExpanded);
    } 
  };

  // a bunch of stuff
  // this handles all the state changes for the sidebar and the highlighting and what not
  return (
    <div className="sidebar d-flex flex-column">
      <div className="nav flex-column">
        {/* we map over all the sections and create a link for each */}
        {Object.keys(sections).map((section) => (
          <React.Fragment key={section}>
            {/* this allows changing classNames so we can do some css magic if the link is active */}
            <NavLink
              to={sections[section]}
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              onClick={() => handleSectionClick(section)}
            >
              <div className="nav-link-container">
                <span>{section}</span>
              </div>
            </NavLink>
            {section === "Choose Role(s)" && isExpanded && (
              <div className="sub-links">
                {Object.keys(roleSections).map((role) => (
                  // same thing as above but for the sublinks
                  <NavLink
                    to={roleSections[role]}
                    className={({ isActive }) => (isActive ? 'nav-item active sub-link' : 'nav-item sub-link')}
                    onClick={() => handleSectionClick(role)}
                    key ={role}
                  >
                    <div className="nav-link">
                      <span className="sub-item">{role}</span>
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
        {/* we have to handle our submit button seperately  
        <NavLink
          to="/Submit"
          className={({ isActive }) => (isActive ? `nav-item active ${formComplete ? '' : 'disabled'}` : `nav-item ${formComplete ? '' : 'disabled'}`)}
          onClick={() => formComplete && handleSectionClick("Submit")} // only handle click if form is complete
        >
          <div className="nav-link">
            <span>Submit</span>
          </div>
        </NavLink>*/}
      </div>
    </div>
  );
};

export default SideBar;