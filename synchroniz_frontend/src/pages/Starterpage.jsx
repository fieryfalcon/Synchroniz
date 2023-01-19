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
}));

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

    const handleClickOpen = () => {
        setOpen(true);
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
        // handle signup logic here
        console.log("firstName: ", firstNameRef.current.value);
        console.log("lastName: ", lastNameRef.current.value);
        console.log("email: ", emailRef.current.value);
        console.log("username: ", usernameRef.current.value);
        console.log("password: ", passwordRef.current.value);
        handleClose();
    };

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        let data;

        axios({
            method: "post",
            url: "http://127.0.0.1:8000/user/api/login/",
            data: {
                username: usernameRef.current.value,
                password: passwordRef.current.value
            },



        }).then((response) => {

            if (response.status === 200) {
                console.log(response.data.refresh);
                Cookies.set('Refresh', response.data.refresh, { expires: 6, secure: true });
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
                Open Signup Form
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Signup Form</DialogTitle>
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
        </div>
    );
}
