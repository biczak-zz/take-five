import React from 'react';

const Button = ({ clickHandler }) => (
  <div id="button-container">
    <button className="bttn-pill bttn-md" onClick={clickHandler}>Generate Numbers</button>
  </div>
);

export default Button;
