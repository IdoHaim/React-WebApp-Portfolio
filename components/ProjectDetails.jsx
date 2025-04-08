import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import CenteredImageModal from "./CenteredImageModal";
import "../style/ProjectDetails.css"; 


function ProjectDetails({ project, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animationIn, setAnimationIn] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  }

  const nextImage = () => {
    handleImageChange((prevIndex) =>
      prevIndex < project.images.length - 1 ? prevIndex + 1 : 0
    );
  };

  const prevImage = () => {
    handleImageChange((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : project.images.length - 1
    );
  };

  const handleImageChange = (index) => {
    setAnimationIn(false); // עצור את האנימציה הנוכחית
    setTimeout(() => {
      setCurrentImageIndex(index); // החלף את התמונה אחרי חצי שניה
      setAnimationIn(true); // הפעל את האנימציה מחדש
    }, 300); // חכה 500 מילי-שניות לפני שינוי התמונה
  };


  return (
        <div className="project-details">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <div className="text-background">
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <small>Category: {project.secondaryCategory}</small>
          </div>

          {/* הגלריה של התמונות */}
          <div className="image-gallery">
            <CSSTransition
              in={animationIn}
              key={project?.images[currentImageIndex]}
              timeout={500}
              classNames="fade"
              unmountOnExit
            >
              <img
                src={project.images[currentImageIndex]}
                alt={`Project Image ${currentImageIndex + 1}`}
                className="project-image"
                onClick={() => setShowModal(true)}
              />
            </CSSTransition>

            {/* נקודות ניווט לתמונות */}
            <div className="d-flex justify-content-center">
              {project.images.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${currentImageIndex === index ? "active" : ""}`}
                  onClick={() => handleImageChange(index)}
                ></span>
              ))}
            </div>
          </div>
      
          <div className="button-container">
            <Button className="equal-button" variant="secondary" onClick={prevImage}>
              Previous Image
            </Button>
            <Button className="equal-button" variant="primary" onClick={nextImage}>
              Next Image
            </Button>
          </div>

      {/* תצוגה מלאה של התמונה */}
      { showModal && (
        <CenteredImageModal
        imageUrl= {project.images[currentImageIndex]}
        onClose={handleClose} 
        />
      )}

    </div>

  );
}

export default ProjectDetails;
