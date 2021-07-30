import React, { useState, useEffect } from 'react';
import '../screenCss/registerScreen.css';
import axios from 'axios';
import { Link, useHistory} from 'react-router-dom';


const RegisterScreen = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            history.push('/')
        }
    }, [history])

    const registerHandler = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        if (password !== confirmPassword) {
            setPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                setError("");
            }, 5000);
            return setError("Password Do not match");
        }

        if (password.toString().length < 6 || confirmPassword.toString().length < 6) {
            setPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                setError("");
            }, 5000);
            return setError("Password must have atleast 6 charactors.");
        }

        try {
            const { data } = await axios.post("/api/auth/register", { username, email, password }, config);
            console.log(data);

            localStorage.setItem("authToken", data.token);
            history.push('/');
        } catch (error) {
            setError(error.response.data.error);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    }

    return (
        <div className="register-screen">
            <form onSubmit={registerHandler} className="register-screen__form">
                <h3 className="register-screen__title">Register</h3>
                {error && <span className="error-message">{error}</span>}
                <div className="form-group">
                    <label htmlFor="name">Username:</label>
                    <input
                        type="text"
                        required
                        id="name"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        required
                        id="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        required
                        id="password"
                        autoComplete="true"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmpassword">Confirm Password:</label>
                    <input
                        type="password"
                        required
                        id="confirmpassword"
                        autoComplete="true"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Register
                </button>

                <span className="register-screen__subtext">
                    Already have an account? <Link to="/login" style={{color:"black"}}>Login</Link>
                </span>
            </form>
        </div>
    )
}

export default RegisterScreen;
