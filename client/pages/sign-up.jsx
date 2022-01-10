import React from 'react';

export default class SignUp extends React.Component {
  render() {
    return (
      <div className='create-account'>
        <h2>Create an account</h2>
        <h6>It&apos;s free and always will be.</h6>
        <form>
          <div className='create-account-name'>
            <input
              className='column-quarter'
              placeholder='First Name'
              required
              type={'text'}
              name='firstName'
            />
            <input
              className='column-quarter'
              placeholder='Last Name'
              required
              type={'text'}
              name='lastName'
            />
          </div>
        <div className='create-account-email-password'>
          <input
            className='column-half'
            placeholder='Email'
            required
            type={'text'}
            name='email'
          />
          <input
              className='column-half'
            placeholder='Password'
            required
            type={'password'}
            name='password'
          />
        </div>
          <button>Create an account</button>
        </form>
        <a href='#signUp/In'>Sign In</a>
      </div>
    );
  }
}
