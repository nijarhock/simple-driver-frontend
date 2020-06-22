import React, { Component } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { setUserSession } from './Utils/Common';
import './style/login.css';

class Login extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            'email': '',
            'password': '',
            'rememberMe': '',
            'loading': false,
            'error': null
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    onSubmit = e => {
        e.preventDefault();
        
        this.setState({
            loading: true,
        });

        axios.post('http://localhost:8000/api/login', 
            { 
                email: this.state.email,
                password: this.state.password
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
                            <Card.Header>Login</Card.Header> 
                            <Card.Body>
                                <Form onSubmit={this.onSubmit}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" name="email" placeholder="Enter email" onChange={this.onChange} value={this.state.email}/>
                                        <Form.Text className="text-muted">
                                            
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" name="password" placeholder="Password" onChange={this.onChange} value={this.state.password}/>
                                    </Form.Group>
                                    <Form.Group controlId="formBasicCheckbox">
                                        <Form.Check type="checkbox" name="rememberMe" label="Remember Me" onChange={this.onChange} defaultChecked={this.state.rememberMe}/>
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Text className="text-muted">
                                            Don't have account  <NavLink to="/register">sign up here</NavLink>
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

export default Login;