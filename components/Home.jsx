import React, { useState, useEffect } from "react";
import { Container, Button, Card, Dropdown } from "react-bootstrap";
import { useProjects } from '../Data/provider';
import NewProjectForm from './NewProjectForm';
import LoginForm from './LoginForm';
import ProjectDetails from "./ProjectDetails";
import ConfirmationPopup from "./ConfirmationPopup";
import Toolbar from "./Toolbar";
import AnimationLogo from "./AnimationLogo";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/Home.css";

function Home() {
  const { projects,isConnected, isLoggedIn, deleteProject } = useProjects(); 
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [projectForEdit,setProjectForEdit] = useState(null);
  const [currentMainCategoryIndex, setCurrentMainCategoryIndex] = useState(0);
  const [currentSecondaryCategoryIndex, setCurrentSecondaryCategoryIndex] = useState(-1);
  const [showPopup,setShowPopup] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setIsLoading(false); 
    }
  }, [projects]);

  if (isLoading) {
    // loading screen (the animation)
    return <div>
      <AnimationLogo></AnimationLogo>

        <div style={{margin:"50px"}}>
          Loading data...
        </div>
      </div>;
  }
  if (!Array.isArray(projects)) {
    console.error("Projects is not an array:", projects);
    return <div> 
      <AnimationLogo></AnimationLogo>

      <div style={{margin:"50px"}}>
        Error
      </div>
    </div>;
  }
  
  // filter projects by category
  const handleCategoryChange = (category) => {
    setCurrentSecondaryCategoryIndex(category);
  };
  // close project details when category has been changed
  const handleSetCurrentMainCategoryIndex = (index) => {
    closeProjectDetails();
    setCurrentMainCategoryIndex(index);
  }
  const handleOpenProjectForm = () => {
    setShowNewProjectForm(true);
  }
  const handleCloseProjectForm = (answer) =>{
    setShowNewProjectForm(answer);
    setProjectForEdit(null);
  }
  
  const closeProjectDetails = () => {
    setSelectedProject(null);
  };
  const handleEditProject = (e,project) => {
    e.stopPropagation(); // stops ProjectDetails from being activated when editing a project
    setProjectForEdit(project);
    handleOpenProjectForm();

    console.log(`Editing project ${project.id}`);
  };
  const handleAnswer = (isConfirmed,obj) => {
    if (isConfirmed) {
      console.log(`Deleting project ${obj.project.id}`);
      deleteProject(obj.project.id);
    } else {
      console.log('Project deletion cancelled');
    }
    setShowPopup(false);
  };
  
  const trimProjectDescription = (project) => {
    if(project.description && project.description.length > 114){
      return project.description.slice(0, 110) + '...';
    }
    return project.description;
  }

  const mainCategories = [...new Set(projects.map((project) => project.mainCategory))];
  const projectsByMainCategory = projects.filter((project) => project.mainCategory === mainCategories[currentMainCategoryIndex]);
  const secondaryCategories = [...new Set(projectsByMainCategory.map((project) => project.secondaryCategory))];

  
    let filteredProjects;
    if (currentSecondaryCategoryIndex == -1) {
      filteredProjects = projectsByMainCategory;
    } else {
      filteredProjects = projectsByMainCategory.filter((project) => 
        project.secondaryCategory === secondaryCategories[currentSecondaryCategoryIndex]);
    }
   

  return (
    <Container className="center-content">

      <div>
        <Toolbar mainCategories = {mainCategories}
          setCurrentMainCategoryIndex = {handleSetCurrentMainCategoryIndex}
          setShowNewProjectForm = {handleOpenProjectForm}
          setShowLoginForm = {setShowLoginForm}>
        </Toolbar>
      </div> 

     <Container className="main-container-setup">
      <div>
      
      {/* Dropdown to filter by category*/}
      <Dropdown className="mb-4">
  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
    {currentSecondaryCategoryIndex !== -1 ? secondaryCategories[currentSecondaryCategoryIndex] : "Filter by Category"}
  </Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item onClick={() => handleCategoryChange(-1)} key="all">
      All
    </Dropdown.Item>
    {secondaryCategories.map((category, idx) => (
      <Dropdown.Item 
        onClick={() => handleCategoryChange(idx)} 
        key={idx} 
      >
        {category}
      </Dropdown.Item>
    ))}
  </Dropdown.Menu>
</Dropdown>


      {/* Shows all of the project's cards */}
      <div className="d-flex flex-wrap justify-content-center">
        {filteredProjects.map((project) => (
        <>
          <Card
            key={project.id}
            style={{ width: "18rem", margin: "10px",border : 0  }}
            className="text-decoration-none text-dark transparent-background"
            onClick={() => setSelectedProject(project)}
            >
            <Card.Img /*variant="top"*/ src={project.images[0]} alt="Project Thumbnail"    
            style={{
            height: "200px", 
            objectFit: "cover", // adjusting the image the the cantainer's size without changing the image's proportion
          }} />
            <Card.Body>
              <Card.Title>{project.title}</Card.Title>
             {/* <Card.Text>{trimProjectDescription(project)}</Card.Text> */}
              <small className="text-muted">Category: {project.secondaryCategory}</small>
            </Card.Body>

          {isLoggedIn && (<>
            <Button
              className="edit-button edit-button-right"
              onClick={(e) => { handleEditProject(e,project); }}> ✎ </Button>                   
 
            <Button
              className="edit-button edit-button-left"
              onClick={(e) => { e.stopPropagation();
                setShowPopup(project.id);
               }}> 🗑 </Button>                        
          </>)}
          </Card>
        { showPopup === project.id && (
          <ConfirmationPopup 
            onAnswer = {handleAnswer}
            popupText = {{headline:'Delete',body:'Are you sure you want to delete "' + 
                          project.title +'" id: ' + project.id,
                          confirm:'Delete',cancel:'Cancel'}}
            obj = {{project}}> 
          </ConfirmationPopup>
        )}
        </>))}
      </div>

      {/* Show selected project details */}
      {selectedProject && (
        <ProjectDetails project={selectedProject} onClose={closeProjectDetails}></ProjectDetails>
      )}

      {/* For adding a new project */}
      <NewProjectForm showModal={showNewProjectForm} setShowModal={handleCloseProjectForm} projectForEdit={projectForEdit}/>
      
      {/* Login */}
      <LoginForm showModal={showLoginForm} setShowModal={setShowLoginForm}></LoginForm>
      </div>
      </Container>
    </Container>
  );
}

export default Home;
