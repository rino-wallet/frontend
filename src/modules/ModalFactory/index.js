import ModalGenerator from "./ModalGenerator";

let Modal;

const ModalContainer = () => (
  <ModalGenerator ref={(node) => { Modal = node; }} />
);

// function to create new promise based modal
const createModal = (Component, options) => (props) => Modal.create(Component, options)(props);

export { ModalContainer, createModal };
