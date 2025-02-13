import React from 'react';
import { Link } from 'react-router-dom';
import style from './login.module.css'

export default function SignUp() {
  const wrapperStyle = {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
    zIndex: '0',
  };

  const diagonalStyle = {
    backgroundColor: '#e0f1f4',
    height: '50%',
    clipPath: 'polygon(0 0, 100% 0, 100% 55%, 0 100%)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: '2',
  };




  return (
    <>
      <div style={wrapperStyle}>
        <div
          style={{
            position: 'absolute',
            content: '""',
            top: '10px',
            left: '10px',
            right: 0,
            height: '500px',
            backgroundColor: '#000',
            opacity: '0.05',
            clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)',
            zIndex: '1',
          }}
        ></div>

        <div style={diagonalStyle}></div>

        <div className="background-balls">

          <div className={style['bottom-right-ball']}/*bottom right ball */></div>

          <div className={style['middle-ball']}/*middle ball */></div>

          <div className={style['bottom-left-ball']}/*bottom left ball */></div>

          <div className={style['top-right-ball']}/*top right */></div>

          <div className={style["top-left-ball"]} /*top left ball */></div>
        </div>


        <div className={style.contaainer + " container d-flex align-items-center justify-content-center"} >
          <div className="row w-100">
            <div className="col-md-6 ">
              <img
                src={require('./../../Images/pngwing.com.png')}
                className="w-25 pt-5"
              />

              <h3 className={style.signinto + " pt-5"}>Sign in to</h3>
              <h2 className={style.headline}>Learning Management System</h2>
            </div>
            <div className="col-md-6">
              <h2 className={style.welcome + ' text-center pt-5'}>Welcome back</h2>

              <form className="pt-5 w-75 mt-5 m-auto bg-white rounded-5 p-4">
                <div className="row">
                  <div className="col-md-7">
                    <h5>Welcome to <span className={style.LMS}>LMS</span></h5>
                    <h2 className={style.signin + ' pb-4'}>
                      Sign In
                    </h2>
                  </div>
                  <div className="col-md-5" >
                    <h6>No Account?</h6>
                    <Link className={style.signupbtn + ' text-decoration-none'} to="/signup">Sign Up </Link>
                  </div>
                </div>
                <div className="row pb-5">


                  <div className="col-md-8">
                    <button className={`${style.googlebtn} btn w-100 text-center`}>
                      <i className="fa-brands fa-google px-2"></i>Sign in with Google
                    </button>
                  </div>


                  <div className="col-md-2 gx-2">
                    <button
                      style={{
                        backgroundColor: '#f1f0f0',
                        transition: 'background-color 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#A9DAD6';
                        e.target.style.color = '#000';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f1f0f0';
                        e.target.style.color = '';
                      }}
                      className="btn w-100"
                    >
                      <i className="fa-brands fa-facebook fs-4"></i>
                    </button>
                  </div>
                  <div className="col-md-2 gx-2">
                    <button
                      style={{
                        backgroundColor: '#f1f0f0',
                        transition: 'background-color 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#A9DAD6';
                        e.target.style.color = '#000';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f1f0f0';
                        e.target.style.color = '';
                      }}
                      className="btn w-100"
                    >
                      <i className="fa-brands fa-apple fs-4"></i>
                    </button>
                  </div>
                </div>

                <label className=" my-2" htmlFor="email">
                  Enter your username or email address
                </label>
                <input placeholder="User name or email" type="email" id="email" className="form-control m-auto rounded-3 pt w-100" />

                <label className=" mt-4" htmlFor="password">
                  Enter Your Password
                </label>
                <input placeholder="Password" type="password" id="password" className="form-control m-auto rounded-3 pt w-100" />

                <h6 className='text-end pt-2'
                  style={{
                    color: '#188B80',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer'

                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#000';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#188B80';
                  }}
                >
                  Forgot Password?
                </h6>
                <button className="btn btn-outline-success w-100 mt-4 m-auto">Sign Up</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
