import React from "react";

const ModalBody = ({ children, className, ...props }) => {
  return (
    <div className={`modal-body ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

export default ModalBody;
