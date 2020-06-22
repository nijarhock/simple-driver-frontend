import React, { Component } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { setUserSession } from './Utils/Common';
import './style/login.css';

class Register extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            'name': '',
            'email': '',
            'password': '',
            'password_confirmation': '',
            'rememberMe': '',
            'loading': false,
            'error': null,
            'error_name': null,
            'error_email': null,
            'error_password': null,
            'error_password_confirmation': null,
            'form_valid': true
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value,
            [`error_${e.target.name}`] : ''
        })

        if(!this.state.error_name && !this.state.error_email && !this.state.error_password && !this.state.error_password_confirmation) {
            this.setState({
                'form_valid': true
            })
        }

        // validate input data
        if(!e.target.value)
        {
            this.setState({
                [`error_${e.target.name}`] : 'Cannot be empty',
                'form_valid': false
            })
        }

        if(typeof e.target.value !== "undefined" && e.target.name === 'name'){
            if(!e.target.value.match(/^[a-zA-Z ]+$/)){
                this.setState({
                    'error_name' : 'Only letters',
                    'form_valid': false
                })
            }        
        }

        if(typeof e.target.value !== "undefined" && e.target.name === 'email'){
            let lastAtPos = e.target.value.lastIndexOf('@');
            let lastDotPos = e.target.value.lastIndexOf('.');
            
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && e.target.value.indexOf('@@') === -1 && lastDotPos > 2 && (e.target.value.length - lastDotPos) > 2)) {
                this.setState({
                    'error_email' : 'Email not valid',
                    'form_valid': false
                })
            }        
        }

        if(typeof e.target.value !== "undefined" && e.target.name === 'password'){
            if(e.target.value.length < 6) {
                this.setState({
                    'error_password' : 'Password minimal 6 character',
                    'form_valid': false
                })
            }       
        }

        if(typeof e.target.value !== "undefined" && e.target.name === 'password_confirmation'){
            if(e.target.value !== this.state.password) {
                this.setState({
                    'error_password_confirmation' : 'Not equal',
                    'form_valid': false
                })
            }       
        }
    }

    onSubmit = e => {
        e.preventDefault();
        
        this.setState({
            loading: true,
        });

        axios.post('http://localhost:8000/api/register', 
            { 
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                password_confirmation: this.state.password_confirmation,
            }
        ).then(response => {
            this.setState({loading: false});
            setUserSession(response.data.token, response.data.user);
            this.props.history.push('/dashboard');
        }).catch(error => {
            console.log(error)
            this.setState({loading: false});
            if(error.response.status === 400)  this.setState({error: error.error});
            else this.setState({error: "Something went wrong. Please try again later"});
        });
    }
    
    render() {
        return(
            <Container className="loginContainer">
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <Card>
                            <Card.Header>Register</Card.Header> 
                            <Card.Body>
                                <Form onSubmit={this.onSubmit}>
                                    <Form.Group controlId="formBasicName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" name="name" placeholder="Enter name" onChange={this.onChange} value={this.state.name}/>
                                        <Form.Text className="text-muted">
                                            {this.state.error_name ? this.state.error_name : ''}
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" name="email" placeholder="Enter email" onChange={this.onChange} value={this.state.email}/>
                                        <Form.Text className="text-muted">
                                            {this.state.error_email ? this.state.error_email : ''}
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" name="password" placeholder="Password" onChange={this.onChange} value={this.state.password}/>
                                        <Form.Text className="text-muted">
                                            {this.state.error_password ? this.state.error_password : ''}
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPasswordConfirmation">
                                        <Form.Label>Confrim Password</Form.Label>
                                        <Form.Control type="password" name="password_confirmation" placeholder="Confirm Password" onChange={this.onChange} value={this.state.password_confirmation}/>
                                        <Form.Text className="text-muted">
                                            {this.state.error_password_confirmation ? this.state.error_password_confirmation : ''}
                                        </Form.Text>
                                    </Form.Group>

                                    <Button variant="primary" type="submit" disabled={this.state.loading}>
                                        {!this.state.loading ? 'Submit' : 'Loading...' }
                                    </Button>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Text className="text-muted">
                                            already have account  <NavLink to="/">sign in here</NavLink>
                                        </Form.Text>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Register;