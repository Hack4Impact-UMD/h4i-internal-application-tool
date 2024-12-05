// App.tsx
import "./App.css";
import { AuthProvider, useAuth } from "./components/test-auth/authhandle"; // Adjust the path as needed
import BootCampForm from "./components/Forms/BootCampForm"; // add form components
import GeneralInfoForm from "./components/Forms/GeneralInfoForm";
import Overview from "./components/Forms/Overview";
import ChooseRolesForm from "./components/Forms/ChooseRolesForm";
import ProductManagerForm from "./components/Forms/ProductManagerForm";
import EngineerForm from "./components/Forms/EngineerForm";
import TechLeadForm from "./components/Forms/TechLeadForm";
import UXForm from "./components/Forms/UXForm";
import SourcingForm from "./components/Forms/SourcingForm";
import DemographicForm from "./components/Forms/DemographicForm";
import SideBar from "./components/NavBar/SideBar";
import SignIn from "./components/test-auth/SignIn"; // signincomponent from other team
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleChanges } from "./handleFormChanges/handleChanges"; // Add the path to the handleChanges file
import { useNavigate } from "react-router-dom";
import headerLogo from './assets/header_logo.png';
import ReviewandSubmit from "./components/Forms/Submit";

const AppContent = () => {
  const { isAuthenticated, signOut } = useAuth();
  const { formData, handleFormDataChange } = handleChanges();
  const [formComplete, setFormComplete] = useState<boolean>(false);
  const [hasRedirected, setHasRedirected] = useState(false); // State to track redirection
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(); // Call the sign-out function
  };

  // Redirect to "Overview" on initial login
  useEffect(() => {
    if (isAuthenticated && !hasRedirected) {
      navigate("/Overview");
      setHasRedirected(true); // Mark as redirected to prevent re-triggering
    }
  }, [isAuthenticated, hasRedirected, navigate]);

  return (
    <div className="app-container d-flex">
      
      {isAuthenticated ? (
        <>
          <header className="app-header">
            <div className="header-right">
              <button className="signout-button" onClick={handleSignOut}>Sign Out</button>
            </div>
            <div className="header-left">
              <img src={headerLogo} alt="Hack4Impact UMD" className="header-logo" />
            </div>
            <div className="header-center">
              <button className="tab-button active">Application</button>
              <button className="tab-button">Status</button>
            </div>
          </header>
          <div className="sidebar-content">
            <SideBar />
            <div className="content-container">
              <Routes>
                <Route path="/Overview" element={<Overview />} />
                <Route
                  path="/General-Information"
                  element={
                    <GeneralInfoForm
                      sectionFormData={formData.generalInfoData}
                      onFormDataChange={(field, value, otherUnchecked) =>
                        handleFormDataChange("generalInfoData", field, value, otherUnchecked)
                      }
                    />
                  }
                />
                <Route
                  path="/Choose-Role(s)"
                  element={
                    <ChooseRolesForm
                      sectionFormData={formData.rolesData}
                      onFormDataChange={(field, value, otherUnchecked) =>
                        handleFormDataChange("rolesData", field, value, otherUnchecked)
                      }
                    />
                  }
                />
                <Route
                  path="/Bootcamp"
                  element={
                    <BootCampForm
                      sectionFormData={formData.bootCampData}
                      onFormDataChange={(field, value, otherUnchecked) =>
                        handleFormDataChange("bootCampData", field, value, otherUnchecked)
                      }
                    />
                  }
                />
                <Route
                  path="/Product-Manager"
                  element={
                    <ProductManagerForm
                      sectionFormData={formData.productManagerData}
                      onFormDataChange={(field, value, otherUnchecked) =>
                        handleFormDataChange("productManagerData", field, value, otherUnchecked)
                      }
                    />
                  }
                />
                <Route
                  path="/Engineer"
                  element={
                    <EngineerForm
                      sectionFormData={formData.engineerData}
                      onFormDataChange={(field, value, otherUnchecked) =>
                        handleFormDataChange("engineerData", field, value, otherUnchecked)
                      }
                    />
                  }
                />
                <Route
                  path="/Tech-Lead"
                  element={
                    <TechLeadForm
                      sectionFormData={formData.techLeadData}
                      onFormDataChange={(field, value, otherUnchecked) =>
                        handleFormDataChange("techLeadData", field, value, otherUnchecked)
                      }
                    />
                  }
                />
                <Route
                  path="/UX-Design"
                  element={
                    <UXForm
                      sectionFormData={formData.UXData}
                      onFormDataChange={(field, value, otherUnchecked) =>
                        handleFormDataChange("UXData", field, value, otherUnchecked)
                      }
                    />
                  }
                />
                <Route
                  path="/Sourcing"
                  element={
                    <SourcingForm
                      sectionFormData={formData.sourcingData}
                      onFormDataChange={(field, value, otherUnchecked) =>
                        handleFormDataChange("sourcingData", field, value, otherUnchecked)
                      }
                    />
                  }
                />
                <Route
                  path="/Demographic-Questions"
                  element={
                    <DemographicForm
                      sectionFormData={formData.demographicData}
                      onFormDataChange={(field, value, otherUnchecked) =>
                        handleFormDataChange("demographicData", field, value, otherUnchecked)
                      }
                    />
                  }
                />
                <Route path="/Submit" element={<ReviewandSubmit />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <SignIn /> 
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;