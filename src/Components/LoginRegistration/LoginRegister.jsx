import React from 'react';
import './LoginRegister.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa6";

const LoginRegister = () => {
  return (
    <div className='wrapper'>
        <div className='form-box login'>
            <form action=''>
                <h1>Login</h1>
                <div className='input-box'>
                    <input type='text' 
                    placeholder='Username' required /> 
                    <FaUser className='icon' />
                </div>
                <div className='input-box'>
                    <input type='password' 
                    placeholder='Password' required /> 
                    <FaLock className='icon' />
                </div>

                <div className='remebember-forgot'>
                    <label>
                        <input type='checkbox' /> Remember me 
                    </label>
                    <a href='#'>Forgot Password?</a>
                </div>

                <button type='submit'>Login</button>

                <div className="register-link">
                    <p>
                        Don't have an account? 
                        <a href='#'> Get Started!</a>
                    </p>
                </div>
            </form>
        </div>

        <div className='form-box SignUp'>
            <form action=''>
                <h1>Sign Up</h1>
                <div className='input-box'>
                    <input type='text' 
                    placeholder='Username' required /> 
                    <FaUser className='icon' />
                </div>
                <div className='input-box'>
                    <input type='email' 
                    placeholder='Email' required /> 
                    <FaEnvelope className='icon' />
                </div>
                <div className='input-box'>
                    <input type='password' 
                    placeholder='Password' required /> 
                    <FaLock className='icon' />
                </div>

                <div className='remebember-forgot'>
                    <label>
                        <input type='checkbox' /> I agree to the terms & conditions
                    </label>
                </div>

                <button type='submit'>Sign Up</button>

                <div className="register-link">
                    <p>
                        Already have an account? 
                        <a href='#'> Login</a>
                    </p>
                </div>
            </form>
        </div>

    </div>
  )
}
 
export default LoginRegister;