
import "./App.css";
import { AuthProvider, useAuth } from "./components/test-auth/authhandle"; // Adjust the path as needed
import Form from "./components/Forms/Form"; // add form components
import TestForm from "./components/Forms/TestForm";
import SignIn from "./components/test-auth/SignIn"; // signincomponent from other team

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? <TestForm /> : <SignIn />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;