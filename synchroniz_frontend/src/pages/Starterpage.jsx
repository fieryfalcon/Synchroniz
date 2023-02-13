import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import axios from 'axios';
import Cookies from 'js-cookie';
import GoogleLogin from 'react-google-login';
import Modal from "@material-ui/core/Modal";


const useStyles = makeStyles((theme) => ({
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    textField: {
        margin: theme.spacing(1),
        width: "25ch",
    },
    formSwitch: {
        textAlign: "center",
        marginTop: theme.spacing(2),
        cursor: "pointer",
    },
    paper: {
        position: "absolute",
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    }
}));

function NewMeetingModal({ onSelectType, onClose }) {
    const classes = useStyles();

    const handleSingleSessionClick = () => {
        onSelectType("Single Session");
    };

    const handlePeerProgrammingClick = () => {
        onSelectType("Peer Programming");
    };

    const handleGroupChatClick = () => {
        onSelectType("Group Chat");
    };

    return (
        <Modal
            open={true}
            onClose={onClose}
        >
            <div className={classes.paper}>
                <h2>Select type of meeting:</h2>
                <Button onClick={handleSingleSessionClick}>Single Session</Button>
                <Button onClick={handlePeerProgrammingClick}>Peer Programming</Button>
                <Button onClick={handleGroupChatClick}>Group Chat</Button>
            </div>
        </Modal>
    );
}


export default function SignupModal() {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordConfirmRef = useRef(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [navigationValue, setNavigationValue] = useState("Signup / Login");
    const [meetingCode, setMeetingCode] = useState('');
    const [open1, setOpen1] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    const handleNewMeetingClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleSelectType = type => {
        setSelectedType(type);
        handleModalClose();
    };


    const handleOpen2 = () => {
        setOpen1(true);
    };

    const handleClose2 = () => {
        setOpen1(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const onSuccess = (response) => {
        // Handle successful sign-in
        console.log(response);
    };

    const onFailure = (response) => {
        // Handle sign-in error
        console.log(response);
    };


    const handleClose = () => {
        setOpen(false);
    };

    const handleSwitchForm = () => {
        setIsLogin(!isLogin);
    };

    const handleSignupSubmit = (event) => {
        event.preventDefault();
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            alert("Passwords do not match");
            return;
        }

        axios({
            method: "post",
            url: "http://127.0.0.1:8000/user/api_view/app_user/",
            data: {
                email: username,
                password: password,
                first_name: firstName,
                last_name: lastName,
            },



        }).then((response) => {

            if (response.status === 200) {
                console.log(response.data.access);
                let access_token = "Bearer " + response.data.access;
                Cookies.set('Refresh', response.data.refresh, { expires: 6, secure: true });
                // console.log(emailRef)
                axios({
                    method: "get",
                    url: 'http://127.0.0.1:8000/user/api_view/app_user/?email=' + username,
                    headers: {
                        'Authorization': `Bearer ${response.data.access}`
                    }
                }).then((response) => {
                    console.log(response.data[0].first_name)
                    console.log(response.data[0].first_name)
                    setNavigationValue(response.data[0].first_name)
                });
            }
            else {
                console.log("no user with such username found")
            }




        });



        console.log("firstName: ", firstNameRef.current.value);
        console.log("lastName: ", lastNameRef.current.value);
        console.log("email: ", emailRef.current.value);
        console.log("username: ", usernameRef.current.value);
        console.log("password: ", passwordRef.current.value);
        handleClose();
    };

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        // setEmail(usernameRef.current.value)


        axios({
            method: "post",
            url: "http://127.0.0.1:8000/user/api/login/",
            data: {
                email: username,
                password: password
            },



        }).then((response) => {

            if (response.status === 200) {
                console.log(response.data.access);
                let access_token = "Bearer " + response.data.access;
                Cookies.set('Refresh', response.data.refresh, { expires: 6, secure: true });
                // console.log(emailRef)
                axios({
                    method: "get",
                    url: 'http://127.0.0.1:8000/user/api_view/app_user/?email=' + username,
                    headers: {
                        'Authorization': `Bearer ${response.data.access}`
                    }
                }).then((response) => {
                    console.log(response.data[0].first_name)
                    console.log(response.data[0].first_name)
                    setNavigationValue(response.data[0].first_name)
                });
            }
            else {
                console.log("no user with such username found")
            }




        });

        console.log("username: ", usernameRef.current.value);
        console.log("password: ", passwordRef.current.value);
        handleClose();
    };
    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                {navigationValue}
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Signup Form</DialogTitle>
                <GoogleLogin
                    clientId="501598956013-mu6f6170kupmdhmhdgnbt24id5ghhd2c.apps.googleusercontent.com"
                    buttonText="Sign in with Google"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    prompt='select_account'
                />
                {/* <GitHubLogin
                    clientId="0d778dfcab4b922a945a"
                    redirectUri=""
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                /> */}
                <DialogContent>
                    {isLogin ? (
                        <form className={classes.form} onSubmit={handleLoginSubmit}>
                            <TextField
                                inputRef={usernameRef}
                                required
                                id="username"
                                label="Username"
                                className={classes.textField}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                inputRef={passwordRef}
                                required
                                id="password"
                                label="Password"
                                type="password"
                                className={classes.textField}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </form>
                    ) : (
                        <form className={classes.form} onSubmit={handleSignupSubmit}>
                            <TextField
                                inputRef={firstNameRef}
                                required
                                id="firstName"
                                label="First Name"
                                className={classes.textField}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <TextField
                                inputRef={lastNameRef}
                                required
                                id="lastName"
                                label="Last Name"
                                className={classes.textField}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <TextField
                                inputRef={emailRef}
                                required
                                id="email"
                                label="Email"
                                type="email"
                                className={classes.textField}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                inputRef={usernameRef}
                                required
                                id="username"
                                label="Username"
                                className={classes.textField}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                inputRef={passwordRef}
                                required
                                id="password"
                                label="Password"
                                type="password"
                                className={classes.textField}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <TextField
                                inputRef={passwordConfirmRef}
                                required
                                id="passwordConfirm"
                                label="Confirm Password"
                                type="password"
                                className={classes.textField}
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                            />
                        </form>
                    )}
                    <Typography
                        className={classes.formSwitch}
                        variant="body2"
                        onClick={handleSwitchForm}
                    >
                        {isLogin ? "Don't have an account? Sign up now" : "Already have an account? Login"}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" onClick={isLogin ? handleLoginSubmit : handleSignupSubmit} color="primary">
                        {isLogin ? "Login" : "Signup"}
                    </Button>
                </DialogActions>
            </Dialog>
            <div>
                <Button variant="contained" color="primary" onClick={handleNewMeetingClick}>New Meeting</Button>
                {isModalOpen && (
                    <NewMeetingModal onSelectType={handleSelectType} onClose={handleModalClose} />
                )}
                {selectedType && <div>You have selected: {selectedType}</div>}
            </div>
            <div>


                <TextField
                    label="Meeting Code"
                    value={meetingCode}
                    onChange={e => setMeetingCode(e.target.value)}
                />
                {meetingCode.length > 0 && (
                    <Button variant="contained" color="secondary">
                        Join
                    </Button>
                )}
            </div>
        </div>

    );
}
