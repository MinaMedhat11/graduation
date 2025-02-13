import React from 'react';
import { Link } from 'react-router-dom';

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
          <div
          /*bottom right */
            style={{
              position: 'absolute',
              bottom: '250px',
              right: '100px',
              width: '150px',
              height: '170px',
              backgroundColor: '#6ecdd4',
              borderRadius: '50%',
              filter: 'blur(50px)',
              zIndex: '-2',
            }}
          ></div>
          <div
          /*bottom right */
            style={{
              position: 'absolute',
              bottom: '50%',
              right: '45%',
              width: '150px',
              height: '170px',
              backgroundColor: '#6ecdd4',
              borderRadius: '50%',
              filter: 'blur(50px)',
              zIndex: '3',
            }}
          ></div>
          <div
          /*bottom left */
            style={{
              position: 'absolute',
              bottom: '250px',
              left: '300px',
              width: '150px',
              height: '170px',
              backgroundColor: '#3168BAA6   ',
              borderRadius: '50%',
              filter: 'blur(40px)',
              zIndex: '-2',
            }}
          ></div>
          <div 
          /*top right */
            style={{
              position: 'absolute',
              top: '50px',
              right: '50px',
              width: '150px',
              height: '170px',
              backgroundColor: '#3168BAA6',
              borderRadius: '50%',
              filter: 'blur(50px)',
              zIndex: '2',
            }}
          ></div>
          <div
          /*top left */
            style={{
              position: 'absolute',
              top: '100px',
              left: '60px',
              width: '150px',
              height: '170px',
              backgroundColor: '#6ecdd4',
              borderRadius: '50%',
              filter: 'blur(30px)',
              zIndex: '2',
            }}
          ></div>
        </div>

        <div className="container d-flex align-items-center justify-content-center" style={{ position: 'relative', zIndex: '3' }}>
          <div className="row w-100">
            <div className="col-md-6 ">
              <img
                src={require('./../../Images/pngwing.com.png')}
                className="w-25 pt-5"
                alt=""
              />
              <h3 className="pt-5" style={{ fontFamily: 'Poppins', color: '#797878' }}>
                Sign up to{' '}
              </h3>
              <h2 style={{ fontFamily: 'Protest Strike', color: '#097B70' }}>
                Learning Management System
              </h2>
            </div>
            <div className="col-md-6">
              <h2
                className="text-center pt-5"
                style={{
                  fontFamily: 'Zen Kaku Gothic Antique',
                  fontWeight: '700',
                  color: '#242424',
                }}
              >
                Welcome back
              </h2>

              <form className="pt-5 w-75 mt-5 m-auto bg-white rounded-5 p-4">
                <div className="row">
                    <div className="col-md-7">
                    <h5>Welcome to <span style={{color:'#188B80'}}>LMS</span></h5>
                <h2 style={{ fontFamily: 'Poppins', color: '#000', fontSize: '55px', fontWeight: '500' }} className="pb-4">
                  Sign Up   
                </h2>
                    </div>
                    <div className="col-md-5" >
                        <h6 style={{fontSize:"15px"}}>Have an Account?</h6>
                        <Link className='text-decoration-none' to='/login' style={{color:'#188B80',fontSize:"17px"}}>Sign in</Link >
                    </div>
                </div>

                <label className=" my-2" htmlFor="email">
                  Enter your username or email address
                </label>
                <input placeholder="User name or email" type="email" id="email" className="form-control m-auto rounded-3 pt w-100" />


                <div className="row">
                    <div className="col-md-6 py-4">
                    <label className=" my-2" htmlFor="name">
                  Your Name
                </label>
                <input placeholder="Your Name" type="text" id="name" className="form-control m-auto rounded-3 pt w-100" />

                    </div>
                    <div className="col-md-6 py-4">
                <label className=" my-2" htmlFor="number">
                  Contact Number
                </label>
                <input placeholder="Contact Number" type="tel" id="number" className="form-control m-auto rounded-3 pt w-100" />

               </div>
                </div>
               
                
                <label className=" my-2" htmlFor="password">
                  Enter Your Password
                </label>
                <input placeholder="Password" type="password" id="password" className="form-control m-auto rounded-3 pt w-100" />

                <button className="btn btn-outline-success w-100 mt-4 m-auto">Sign Up</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
