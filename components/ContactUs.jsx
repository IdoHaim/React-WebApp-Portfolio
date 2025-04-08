import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';


function ContactUs() {
  
  return (
    <div style={{display:'flex', backgroundColor: 'transparent', padding: '20px', borderRadius: '8px', color: 'white' }}  >
      {/* אזור Contact Us - ממורכז */}
      <Container>
        <Row>
          <Col>
            <div className="text-center">
              <h2>Contact</h2>
              <p>noaarch</p>
              <p>45b Borochov st.</p>
              <p>Kiryat Tivon</p>
              <p>3604638</p>
              <p>mob : 972-54-4560190</p>
              <p>tel : 972-73-7319272</p>
              <p>fax : 153-544-560190</p>
              <p>email : <a href="mailto:office@noaarch.com">office@noaarch.com</a></p>

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ContactUs;
