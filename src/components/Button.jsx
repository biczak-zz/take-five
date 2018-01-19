import React from 'react';

const Button = ({ clickHandler, noRestrictions }) => (
  <div id="button-container">
    <button className="bttn-pill bttn-md" onClick={clickHandler}>Generate Numbers</button>
    <button className="btn third" onClick={noRestrictions}>No Restritctions</button>
    <span id="bottom-button">Click the bottom Button to Generate 5 Random Numbers (Between 1 - 39) without any restrictions / parameters.</span>
  </div>
);

export default Button;
