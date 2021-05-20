import React from 'react'
import './../../css/Register.css'
function Register() {

    return (
        <main className="form-signup">
            <form>
            <h1 className="h3 mb-3 fw-normal">Registration</h1>
            <div className="form-floating">
            <input type="text" className="form-control" id="floatingInput" placeholder="Name"/>
                <label htmlFor="floatingInput">Name</label>
            </div>
            <div className="form-floating">
            <input type="text" className="form-control" id="floatingInput" placeholder="Surname"/>
                <label htmlFor="floatingInput">Surname</label>
            </div>
            <div className="form-floating">
            <input type="date" className="form-control" id="floatingInput" placeholder="Date of birth"/>
                <label htmlFor="example-date-input">Date of birth</label>
            </div>
            <div className="form-floating">
            <input class="form-control" type="tel"></input>
                <label htmlFor="phone">phone number</label>
            </div>
            <div className="form-floating">
                <input type="email" className="form-control" id="floatingInput" placeholder="Email address"/>
                <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password"/>
                <label htmlFor="floatingPassword">Password</label>
            </div>
            <div className="form-floating">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password"/>
                <label htmlFor="floatingPassword">Repeate password</label>
            </div>
    <button className="w-100 btn btn-lg btn-primary" type="submit">Sign up</button>
            </form>
        </main>
    );
};
export default Register;