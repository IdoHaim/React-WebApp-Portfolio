import React, { useState } from 'react';
import { useProjects } from '../Data/provider';
import { Button, Container, Navbar, ButtonGroup, ToggleButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/Toolbar.css";

function Toolbar({mainCategories,setCurrentMainCategoryIndex,setShowNewProjectForm,setShowLoginForm}) {

  const { isLoggedIn } = useProjects(); 
  const [categoryIndex, setCategoryIndex] = useState(0);

  const changeCategory = (idx) => {
    setCategoryIndex(idx);
    setCurrentMainCategoryIndex(idx);
  };
  
  return (
    <div>
    {/* ToolBar */}
    <Navbar className="toolbar-with-background fixed-top">
      <Container className="d-flex justify-content-center">
      <div className="d-flex flex-column align-items-center">
      {/*<h5 style={{ fontSize: '16px', color: 'white' }}></h5> ToolBar */}
      <ButtonGroup>
        {mainCategories.map((category, idx) => (
          <ToggleButton
            key={idx}
            id={`category-${idx}`}
            type="radio"
            variant="outline-light"
            name="category"
            value={idx}
            onClick={(e) => changeCategory(idx)}
            checked={mainCategories[categoryIndex] === category}
          >
            {category}
          </ToggleButton>
        ))}
      </ButtonGroup>
      </div>
      </Container>
    </Navbar>
    <div className='side-buttons'>

      {!isLoggedIn ? (
        <Button variant="primary"  onClick={() => setShowLoginForm(true)}>
          Log In
        </Button>
      ) : (
        <Button variant="primary"  onClick={() => setShowNewProjectForm()}>
              Add Project
        </Button>)}

    </div>
  </div>
  

  );
}

export default Toolbar;
