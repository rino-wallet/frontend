import React, { PureComponent, Fragment } from "react";
import ReactDOM from "react-dom";

// generate random hash for modal
const getHash = () => Math.random().toString(36).substr(2, 9);

export default class ModalGenerator extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modals: {},
    };
  }

  // remove modal from 'this.state.modals'
  onDelete = (modalHash) => {
    const modals = { ...this.state.modals };
    delete modals[modalHash];
    this.setState({ modals });
  };

  // get list of modals
  get modals() {
    const { modals } = this.state;
    return Object.entries(modals).map(([key, modal]) => {
      const {
        Component, props, resolve, reject, options,
      } = modal;
      const { parentNode } = options;
      const Modal = (
        <Component
          {...props}
          key={key}
          cancel={reject}
          submit={resolve}
        />
      );
      return parentNode ? ReactDOM.createPortal(Modal, parentNode) : Modal;
    });
  }

  create = (Component, options = {}) => (props) => new Promise((promiseResolve, promiseReject) => {
    const { modals } = this.state;
    // generate random hash for new modal
    const modalHash = getHash();
    // callback to close modal and resolve modal promise
    const resolve = (value) => {
      this.onDelete(modalHash);
      promiseResolve(value);
    };
    // callback to close modal and reject modal promise
    const reject = (value) => {
      this.onDelete(modalHash);
      promiseReject(value);
    };
    // add new modal into 'this.state.modals'
    this.setState({
      modals: {
        ...modals,
        [modalHash]: {
          resolve,
          reject,
          Component,
          props,
          options,
        },
      },
    });
  });

  render() {
    return (
      <>
        {this.modals}
      </>
    );
  }
}
