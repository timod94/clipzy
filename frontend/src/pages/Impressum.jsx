import React from 'react';
import { IoIosMail } from "react-icons/io";



const Impressum = () => {
  return (
    <div className="impressum">
      <h1>Impressum</h1>
      <h3>Project Name: Clipzy</h3>
      
      <p>Clipzy is a platform for sharing and watching videos.</p>
      <p>For inquiries, feel free to <a href="mailto:timo.dorst@example.com">contact me via email</a> <IoIosMail /></p>
      <h4>Created by: Timo Dorst</h4>
    </div>
  );
};

export default Impressum;