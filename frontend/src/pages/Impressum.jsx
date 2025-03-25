import React from 'react';
import { IoIosMail } from "react-icons/io";



const Impressum = () => {
  return (
    <div className="impressum">
      <h1>Impressum</h1>
      <h3>Project Name: Clipzy</h3>
      
      <p>Clipzy is a platform to host videos that can be securely shared and analyzed for valuable insights.</p>

      <p>For inquiries, feel free to <a href="mailto:timod2310@gmail.com">contact me via email</a> <IoIosMail /></p>
      <h4>Created by: Timo Dorst</h4>
    </div>
  );
};

export default Impressum;