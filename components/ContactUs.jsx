import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';


function ContactUs() {
  
  return (
    <div style={{display:'flex', backgroundColor: 'transparent', padding: '20px', borderRadius: '8px', color: 'white' }}  >

      <Container>
        <Row>
          <Col>
            <div className="text-center">
              <h2>Contact</h2>
              <p> Name </p>
              <p> ... </p>
              <p> ... </p>
              <p> ... </p>
              <p> ... </p>
              <p> ... </p>
              <p> ... </p>
              <p>email : <a href="mailto:abcde.com">office@abcde.com</a></p>

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ContactUs;
