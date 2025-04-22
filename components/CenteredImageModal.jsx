import React, { useState ,useEffect } from "react";
import "../style/ImageModal.css";

function CenteredImageModal({ imageUrl, onClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // prevent scrolling in the main page
  useEffect(() => {
   document.body.style.overflow = "hidden"; // lock scrolling
   return () => {
     document.body.style.overflow = "auto"; // unlock scrolling
   };
 }, []);

  const handleZoomIn = () => setScale((prevScale) => prevScale + 0.1);
  const handleZoomOut = () => setScale((prevScale) => (prevScale > 0.1 ? prevScale - 0.1 : prevScale));

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomStep = 0.1; // zoom in and out with the scroller
    if (e.deltaY < 0) {
      // scroll up
      setScale((prevScale) => prevScale + zoomStep);
    } else {
      // scroll down
      setScale((prevScale) => (prevScale > zoomStep ? prevScale - zoomStep : prevScale));
    }
  };

  // dragging the picture
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div>
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="controls">
            <button className="close" onClick={() => onClose()}>
              &times;
            </button>
            <button className="menu-button" onClick={handleZoomIn}>
              +
            </button>
            <button className="menu-button" onClick={handleZoomOut}>
              -
            </button>
          </div>
          <div
            className="image-container"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel} 
          >
            <img
              src={imageUrl}
              alt="Centered"
              className="modal-image"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? "grabbing" : "grab",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CenteredImageModal;
