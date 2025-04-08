import React, { useState,useEffect } from "react";
import { Button, Modal, Dropdown, Alert } from "react-bootstrap";
import { useProjects } from "../Data/provider";
import "../style/NewProjectForm.css";


function NewProjectForm({ showModal, setShowModal, projectForEdit }) {
  const { projects, addProject, editProject } = useProjects();
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    mainCategory: "",
    secondaryCategory: "",
    images: [],
  });
  useEffect(() => {
    if (projectForEdit) {
      setNewProject({
        title: projectForEdit.title,
        description: projectForEdit.description,
        mainCategory: projectForEdit.mainCategory,
        secondaryCategory: projectForEdit.secondaryCategory,
        images: projectForEdit.images || [],
        id: projectForEdit.id
      });
    }
  }, [projectForEdit]);
  
  const [showMainCategories, setShowMainCategories] = useState(false);
  const [showSecondaryCategories, setShowSecondaryCategories] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleDeleteImage = (index , event) => {
    event.preventDefault();
    const updatedImages = [...newProject.images];
    updatedImages.splice(index, 1); // מסירה את התמונה לפי אינדקס
    setNewProject({ ...newProject, images: updatedImages }); // עדכון ה-state
  };

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
    setNewProject({ ...newProject, images: [...newProject.images, ...newImages] });
    console.log(newProject.images)
  };

  const reorderImage = (imageIndex,nextDirection,event) => {
    event.preventDefault();
    const nextimg = newProject.images[imageIndex + nextDirection];
    if(nextimg === null || nextimg === undefined) return;

    const thisimg = newProject.images[imageIndex];
    const updatedImages = [...newProject.images];

    updatedImages[imageIndex] = nextimg;
    updatedImages[imageIndex + nextDirection] = thisimg;
    setNewProject({ ...newProject, images: updatedImages });
  }

  const closeForm = (isSuccess) => {
    setError("");
    setSuccess(isSuccess);
    setNewProject({ title: "", description: "", mainCategory: "", secondaryCategory: "", images: [] });
    setShowModal(false);
  };

  const handleAddProject = () => {
    const isValid = Object.keys(newProject)
  .filter((key) => key !== "id") 
  .every(
    (key) =>
      newProject[key] !== undefined && 
      newProject[key] !== null && 
      ((Array.isArray(newProject[key]) && newProject[key].length > 0) || 
       (typeof newProject[key] === "string" && newProject[key].trim() !== "")) 
  );
    if(isValid){ 
      if(newProject.id != null){
        editProject({...newProject});
      }
      else{
        addProject({
          ...newProject,
          id: 0,
        });
      }
      
      closeForm(true);
    }
    else{
      setError("All fields are required.");
      setSuccess(false);
    }
  };

  const mainCategories = [...new Set(projects.map((project) => project.mainCategory))];
  const secondaryCategories = [...new Set(projects.map((project) => project.secondaryCategory))];


  return (
    <Modal show={showModal} onHide={() => closeForm(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Login successful!</Alert>}

        <form>
          <div className="mb-3">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label>Main Category</label>
            <input
              type="text"
              className="form-control"
              value={newProject.mainCategory}
              onClick={() => {
                if (mainCategories[0] !== "") {
                  setShowMainCategories(!showMainCategories);
                }
              }}
              onChange={(e) => setNewProject({ ...newProject, mainCategory: e.target.value })}
            />
            {showMainCategories && (
              <SuggestCategories
                setField={(value) => setNewProject({ ...newProject, mainCategory: value })}
                categories={mainCategories}
              />
            )}
          </div>
          <div className="mb-3">
            <label>Secondary Category</label>
            <input
              type="text"
              className="form-control"
              value={newProject.secondaryCategory}
              onClick={() => {
                if (secondaryCategories[0] !== "") {
                  setShowSecondaryCategories(!showSecondaryCategories);
                }
              }}
              onChange={(e) => setNewProject({ ...newProject, secondaryCategory: e.target.value })}
            />
            {showSecondaryCategories && (
              <SuggestCategories
                setField={(value) => setNewProject({ ...newProject, secondaryCategory: value })}
                categories={secondaryCategories}
              />
            )}
          </div>
          <div
            className="mb-3 border p-3 rounded"
            style={{ border: "2px dashed #ccc", textAlign: "center" }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleImageUpload(e.dataTransfer.files);
            }}
          >
            <label>Drag and Drop Images Here</label>
            <input
              type="file"
              className="form-control mt-2"
              multiple
              onChange={(e) => handleImageUpload(e.target.files)}
            />
            <div className="mt-2">
              {newProject.images.map((image, index) => (
                <div key={index} style={{ display: 'inline-block', margin: '5px', position: 'relative' }}>
                  <img
                    src={image}
                    alt={`Preview ${index}`}
                    style={{ width: "100px", height: "100px", display: 'block' }}
                  />
                 
              {newProject.images[index + 1] &&
                  <button
                    type="button"
                    onClick={(e) => reorderImage(index,1,e)}
                    className="side-button side-button-right"
                  >
                    &gt;
                  </button>}
                  {newProject.images[index - 1] &&
                  <button
                    type="button"
                    onClick={(e) => reorderImage(index,-1,e)}
                    className="side-button side-button-left"
                  >
                     &lt;
                  </button>}
                   <button
                    onClick={(e) => handleDeleteImage(index, e)}
                    className="deletebutton"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAddProject}>
          Add Project
        </Button>
      </Modal.Footer>
    </Modal>
  );
}



function SuggestCategories({ setField, categories }) {
  return (
    <Dropdown>
      <Dropdown.Menu show>
        {categories.map((categoryItem, index) => (
          <Dropdown.Item key={index} onClick={() => setField(categoryItem)}>
            {categoryItem}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}



export default NewProjectForm;
