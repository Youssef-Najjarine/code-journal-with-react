import React from 'react';

export default class SignUpSignIn extends React.Component {
  render() {
    return (
      <div className='sign-up-sign-in'>
        <img className='logo' src='./favicon.ico'/>
        <form>
          <div className='sign-up-div'>
            <input
              placeholder='Email'
                  required
                  type={'text'}
                  name='email'
                  />
            <input
                  placeholder='Password'
                  required
                  type={'password'}
                  name='password'
                  />
          </div>
          <button>Log In</button>
        </form>
        <a href='#signUp'>Create an Account</a>
      </div>
    );
  }
}
