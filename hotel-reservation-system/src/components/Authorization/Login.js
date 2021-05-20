import React from 'react'
import './../../css/Login.css'
import {Link} from 'react-router-dom'
function Login() {

    return (
        <main className="form-signin">
            <form>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
            <div className="form-floating">
                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"/>
                <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password"/>
                <label htmlFor="floatingPassword">Password</label>
            </div>

    <div className="checkbox mb-3">
    </div>
    <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
            </form>
            <Link to="/register" className="text-primary">
            <label>don't have an account?</label>
            </Link>
        </main>
    );
};
export default Login;