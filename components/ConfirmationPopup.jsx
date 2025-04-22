import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap'; 

/**
 * @param {function onAnswer(bool,object) {}}
 * @param {object} popupText - contain these fields: 
 * headline (default: 'Confirmation'),
 * body (default: 'Are you sure you want to proceed?'),
 * confirm (default: 'Confirm'),
 * cancel (default: 'Cancel').   
 * @param {object} obj - to pass any information from the caller
 */
function ConfirmationPopup({onAnswer,popupText,obj}) {
  const [show, setShow] = useState(true); 


  const handleClose = (answer) => {
    setShow(false);   
    onAnswer(answer,obj);
    if(answer){
      console.log('Confirmed!');
    }
}


  return (
    <div>     
      <Modal show={show} onHide={() => handleClose(false)}>
        <Modal.Header style={{justifyContent: 'center'}}> 
            <Modal.Title>
            {popupText.headline ? (    
               popupText.headline
            ) : ('Confirmation')}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{textAlign: 'center'}}>
        {popupText.body ? (    
               popupText.body
            ) : (' Are you sure you want to proceed?')}       
            </Modal.Body>
        <Modal.Footer style={{justifyContent: 'center' }}>
          <Button variant="secondary" onClick={() => handleClose(false)}>
          {popupText.cancel ? (    
               popupText.cancel
            ) : ('Cancel')}       
          </Button>
          <Button variant="danger" onClick={() => handleClose(true)}>
          {popupText.confirm ? (    
               popupText.confirm
            ) : ('Confirm')}      
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ConfirmationPopup;
