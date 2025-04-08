import React from "react";
import { BrowserRouter as Router } from "react-router-dom"; 
import Home from "./components/Home"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container } from "react-bootstrap";
import ContactUs from "./components/ContactUs";
import "./style/App.css";
import { ProjectsProvider } from './Data/provider';


function App() {
  return (
    <Container className="main-content" style={{ position: "absolute", left: 0, right: 0, width: "100%" }}>
      <Col>
        <Router>
         <ProjectsProvider>       
            <Container className="main-container">
            
              <Home />
            
            </Container>
          </ProjectsProvider>
        </Router>
   
        <ContactUs></ContactUs>
      
      </Col>
    </Container>
  );
}

export default App;
