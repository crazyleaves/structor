import React, { Component, PropTypes } from 'react';

import {
    Button
} from 'react-bootstrap';

class FormComponentVariantName extends Component {

    constructor(props) {
        super(props);
        this.state = {
            variantName: props.variantName
        };
        this.handleVariantNameChange = this.handleVariantNameChange.bind(this);
        this.handleBackStep = this.handleBackStep.bind(this);
        this.handleSubmitStep = this.handleSubmitStep.bind(this);
    }


    handleVariantNameChange() {
        var variantName = this.refs.variantNameInput.value;
        var newState = {
            variantName: variantName
        };
        this.setState(newState);
    }


    handleBackStep(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onBackStep) {
            this.props.onBackStep(this.getOptions());
        }
    }

    handleSubmitStep(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onSubmitStep) {
            this.props.onSubmitStep(this.getOptions());
        }
    }

    getOptions() {
        return {
            variantName: this.refs.variantNameInput.value
        }
    }

    componentDidMount() {
        this.refs.variantNameInput.focus();
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div style={this.props.formStyle}>
                <table style={{width: '100%'}}>
                    <tbody>
                    <tr>
                        <td style={{width: '20%'}}></td>
                        <td style={{height: '100%', verticalAlign: 'middle'}}>
                            <div className="form-group">
                                <label htmlFor='variantNameElement'>Variant name:</label>
                                <input id='variantNameElement'
                                       ref='variantNameInput'
                                       className="form-control input-sm"
                                       type="text"
                                       placeholder='Name'
                                       value={this.state.variantName}
                                       onChange={this.handleVariantNameChange}
                                    />
                            </div>
                        </td>
                        <td style={{width: '20%'}}></td>
                    </tr>
                    <tr>
                        <td colSpan='3'></td>
                    </tr>
                    </tbody>
                </table>
                <div style={{display: 'table', textAlign: 'center', width: '100%', marginTop: '2em'}}>
                    {/*<Button bsStyle='default' onClick={this._handleBackStep}>Back</Button>*/}
                    <Button bsStyle='primary' onClick={this.handleSubmitStep}>Next</Button>
                </div>
            </div>
        );
    }

}

export default FormComponentVariantName;
