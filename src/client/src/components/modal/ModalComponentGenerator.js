import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
    Modal, Input, ListGroup, ListGroupItem,
    Badge, PanelGroup, Tabs, Tab,
    Grid, Row, Col, Panel, Button, Nav,
    CollapsibleNav, Navbar, DropdownButton,
    MenuItem, NavItem
} from 'react-bootstrap';

import * as ModalComponentGeneratorActions from '../../actions/modalComponentGeneratorActions.js';

import WizardGenerateComponent from '../wizard/WizardGenerateComponent.js';

class ModalComponentGenerator extends Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.hideModalComponentGenerator();
    }

    render(){
        let wizardElement = this.props.isOpen ? <WizardGenerateComponent /> : null;
        return (
            <Modal show={this.props.isOpen}
                   onHide={this.props.hideModalComponentGenerator}
                   dialogClassName='umy-modal-overlay'
                   backdrop={true}
                   keyboard={true}
                   bsSize='large'
                   ref='dialog'
                   animation={true}>
                {/*<Modal.Header closeButton={false} aria-labelledby='contained-modal-title'>
                 <Modal.Title id='contained-modal-title'>Generate component's source code</Modal.Title>
                 </Modal.Header>*/}
                <Modal.Body>
                    <div>
                        {wizardElement}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


ModalComponentGenerator.defaultProps = {
    onHide: null
};


function mapStateToProps(state) {
    const { modalComponentGenerator } = state;
    return {
        isOpen: modalComponentGenerator.isOpen
    };
}

//function mapDispatchToProps(dispatch) {
//    return {
//        //onIncrement: () => dispatch(increment())
//    };
//}

export default connect(
    mapStateToProps,
    ModalComponentGeneratorActions
)(ModalComponentGenerator);

