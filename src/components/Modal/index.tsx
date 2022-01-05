import React from "react";

const ModalBody: React.FC = ({ children }) => {
  return (
    <div className="p-5 flex-auto justify-center">
      {children}
    </div>
  )
}

const ModalActions: React.FC = ({ children }) => {
  return (
    <div className="p-3 mt-2 text-center space-x-4 md:block">
      {children}
    </div>
  )
}

interface Props {
  title: string;
}

const Modal: React.FC<Props> & { Body: typeof ModalBody; Actions: typeof ModalActions } = ({ title, children }) => {
  return (
    <div className="bg-purple-200 bg-opacity-50 min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-1 z-50 outline-none focus:outline-none">
      <div className="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
        <div className="">
          <h2 className="text-xl text-center font-bold py-4 ">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  )
}


Modal.Body = ModalBody;
Modal.Actions = ModalActions;

export default Modal;
