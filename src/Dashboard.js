import React, { Component } from 'react';
import { Navbar, Nav, Breadcrumb, Card, Row, Col, Toast, Button, Modal, Form } from 'react-bootstrap';
import { getUser, getToken, removeUserSession } from './Utils/Common';
import axios from 'axios';

class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            'items': [],
            'updateID': null,
            'statusUpdate': false,
            'name': '',
            'clickID': null,
            'statusClick': false,
            'nameClick': null,
            'root': null,
            'modalShow': false,
            'file'  : '',
            'errorServer' : null
        }

        this.onChange = this.onChange.bind(this);
    }

    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    componentDidMount() {
        this.getDocuments();
    }

    handleLogout = () => {
        removeUserSession();
        this.props.history.push('/');
    }

    getDocuments = () => {
        const user = getUser();
        let path = this.props.location.pathname;
        path = path.replace("/dashboard/", "");
        path = path.replace("/dashboard", "");
        if(!path)
        {
            path = "master";
        }
        if(this.state.root)
        {
            path = this.state.root;
        }
        const token = getToken();
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        axios.get(`http://localhost:8000/api/document?id=${user.id}&root=${path}`, 
            config
        ).then(response => {
            this.setState ({
                'items': [...response.data.documents],
                'root': path
            })
        }).catch(error => {
            if(error.response.status === 401)  return this.props.history.push('/login');
            else this.setState({errorServer: "Something went wrong. Please try again later"});
        });
    }

    newFolder = () => {
        const user = getUser();
        let path = this.props.location.pathname;
        console.log(path)
        path = path.replace("/dashboard/", "");
        path = path.replace("/dashboard", "");
        if(!path)
        {
            path = "master";
        }
        const token = getToken();
        const bodyParams = {
            id: user.id,
            root: path
        }
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        axios.post(`http://localhost:8000/api/document`, 
            bodyParams,
            config
        ).then(response => {
            this.setState ({
                'updateID': response.data.documents.id,
                'name': response.data.documents.name,
                'statusUpdate': true
            });
            this.getDocuments();
        }).catch(error => {
            if(error.response.status === 401)  return this.props.history.push('/login');
            else this.setState({errorServer: "Something went wrong. Please try again later"});
        });
    }

    changeName = () => {
        const token = getToken();
        const user = getUser();
        let path = this.props.location.pathname;
        path = path.replace("/dashboard/", "");
        path = path.replace("/dashboard", "");
        if(!path)
        {
            path = "master";
        }

        const bodyParams = {
            name: this.state.name,
            user_id: user.id,
            root: path
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        axios.put(`http://localhost:8000/api/document/${this.state.updateID}`, 
            bodyParams,
            config
        ).then(response => {
            this.setState ({
                'updateID': null,
                'statusUpdate': false,
                'name': ''
            });
            this.getDocuments();
        }).catch(error => {
            console.log(error)
            if(error.response.status === 401)  return this.props.history.push('/login');
            else this.setState({errorServer: "Something went wrong. Please try again later"});
            
            this.setState ({
                'updateID': null,
                'statusUpdate': false,
                'name': ''
            });
            this.getDocuments();
        });
    }

    handleBlurClick = () => {
        this.setState({
            'clickID': null,
            'nameClick': null,
            'statusClick': false
        });
    }

    handleClick = (id, name, ext) => {
        if(this.state.clickID === id)
        {
            if(ext === 'folder') {
                this.setState({
                    'clickID': null,
                    'nameClick': null,
                    'statusClick': false
                });
                let path = this.props.location.pathname;
                if(this.state.root === "master")
                {
                    this.props.history.push(`${path}/master/${name}`);
                    this.setState({
                        'root': `master/${name}`,
                        'clickID': null,
                        'statusClick': false,
                        'nameClick': null,
                    }, () => {
                        this.getDocuments();
                    });
                }
                else
                {
                    this.props.history.push(`${path}/${name}`);
                    this.setState({
                        'root': `${this.state.root}/${name}`,
                        'clickID': null,
                        'statusClick': false,
                        'nameClick': null,
                    }, () => {
                        this.getDocuments();
                    });
                }
            }
            else {
                window.open(`http://localhost:8000/file_upload/${name}`, "_blank");
            }
        }
        this.setState({
            'clickID': id,
            'nameClick': name,
            'statusClick': true
        });
    }

    handleKeyDown = e => {
        if(e.key === 'Enter')
        {
            this.changeName();
        }
    }

    handleRename = () => {
        if(this.state.statusClick) {
            this.setState ({
                'updateID': this.state.clickID,
                'name': this.state.nameClick,
                'statusUpdate': true
            });
        }
    }

    handleDelete = () => {
        const token = getToken();
        const user = getUser();
        let path = this.props.location.pathname;
        path = path.replace("/dashboard/", "");
        path = path.replace("/dashboard", "");
        if(!path)
        {
            path = "master";
        }

        const bodyParams = {
            name: this.state.nameClick,
            user_id: user.id,
            root: path
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        axios.delete(`http://localhost:8000/api/document/${this.state.clickID}`, 
           config
        ).then(response => {
            this.setState({
                'clickID': null,
                'nameClick': null,
                'statusClick': false
            });
            this.getDocuments();
        }).catch(error => {
            console.log(error);
            if(error.response.status === 401)  return this.props.history.push('/login');
            else this.setState({errorServer: "Something went wrong. Please try again later"});
            
            this.setState({
                'clickID': null,
                'nameClick': null,
                'statusClick': false
            });
            this.getDocuments();
        });
    }

    showModal = () => {
        this.setState({
            'modalShow': true
        });
    }

    hideModal = () => {
        this.setState({
            'modalShow': false
        });
    } 

    setFile = (e) => {
        this.setState({ file: e.target.files[0] });
    }

    uploadFile = () => {
        const token = getToken();
        const user = getUser();
        let path = this.props.location.pathname;
        path = path.replace("/dashboard/", "");
        path = path.replace("/dashboard", "");
        if(!path)
        {
            path = "master";
        }

        const formData = new FormData();
        formData.append('file', this.state.file);
        formData.append('user_id', user.id);
        formData.append('root', path);


        const config = {
            headers: { 
                Authorization: `Bearer ${token}`,
                'content-type': 'multipart/form-data',
            }
        };

        axios.post(`http://localhost:8000/api/upload`,
            formData, 
            config
        ).then(response => {
            this.setState({
                'file': '',
                'modalShow': false,
            });
            this.getDocuments();
        }).catch(error => {
            console.log(error)
            if(error.response.status === 401)  return this.props.history.push('/login');
            else this.setState({errorServer: "Something went wrong. Please try again later"});
            
            this.setState({
                'file': '',
                'modalShow': false,
            });
            this.getDocuments();
        });
    }

    renderSwitch = ext => {
        switch (ext) {
            case 'folder':
                return 'fas fa-folder';
            case 'doc':
                return 'fas fa-file-word';
            case 'docx':
                return 'fas fa-file-word';
            case 'xls':
                return 'fas fa-file-excel';
            case 'xlsx':
                return 'fas fa-file-excel';
            case 'pdf':
                return 'fas fa-file-pdf';
            case 'zip':
                return 'fas fa-file-archive';
            case 'rar':
                return 'fas fa-file-archive';
            default:
                return 'fas fa-folder';
        }
    }

    render() {
        if(this.state.root)
        {
            var root_arr = this.state.root.split("/");
        }
        else
        {
            var root_arr = ['master'];
        }
        return (
            <div>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand href="#home">Simple Driver</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link onClick={this.newFolder}>New Folder</Nav.Link>
                            <Nav.Link onClick={this.showModal}>Upload</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link onClick={this.handleLogout}>Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Breadcrumb>
                    {root_arr.map((value, index) => (
                        <Breadcrumb.Item href="/dashboard" key={index}>{value}</Breadcrumb.Item>
                    ))}
                </Breadcrumb>
                <Row>
                    {this.state.items.map((item, index) => (
                    <Col xs={4} lg={2} key={index} onClick={() => this.handleClick(item.id, item.name, item.ext)} style={{ cursor:'pointer' }}>
                        <Card className="listFile">
                            <Card.Body className={`${this.state.clickID === item.id ? 'active' : ''}`}>
                                <Card.Title className="text-center">
                                    <span className="folder">
                                        <i className={this.renderSwitch(item.ext)}></i>
                                    </span> <br />
                                    {item.id === this.state.updateID && this.state.statusUpdate ? 
                                    (
                                        <input type="text" className="form-control" name="name" value={this.state.name} autoFocus onBlur={this.changeName} onChange={this.onChange} onKeyDown={this.handleKeyDown} />
                                    ) : 
                                    (
                                        item.name
                                    )}
                                </Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                    ))}
                </Row>
                <div
                aria-live="polite"
                aria-atomic="true"
                style={{
                    position: 'relative',
                    minHeight: '100px',
                }}
                >
                    <Toast
                        show={this.state.statusClick}
                        onClose={this.handleBlurClick}
                        style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        }}
                    >
                        <Toast.Header>
                        <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                        <strong className="mr-auto">{this.state.nameClick}</strong>
                        </Toast.Header>
                        <Toast.Body>
                            <Button variant="primary" onClick={this.handleRename}>Rename</Button>
                            <Button variant="info">Copy</Button>
                            <Button variant="danger" onClick={this.handleDelete}>Delete</Button>
                        </Toast.Body>
                    </Toast>
                </div>
                <div>
                    <Modal show={this.state.modalShow} onHide={this.hideModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Upload File</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group>
                                    <Form.File id="uploadFile" label="Upload File Here (ext : xsl, doc, pdf, zip, rar)" onChange={e => this.setFile(e) } />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.hideModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={this.uploadFile}>
                                Upload
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Dashboard;