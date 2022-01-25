import React from 'react';
import ClientError from '../../server/client-error';
export default class SignUpSignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'you@yahoo.com',
      password: 'apples'
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { email, password } = this.state;
    const newAccount = { email, password };
    if (!email || !password) {
      throw new ClientError(400, 'Please enter a valid email and password.');
    } else {
      fetch('/api/users/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAccount)
      })
        .then(response => response.json())
        .then(currentAccount => {
          const currentUser = {
            token: currentAccount.token,
            userId: currentAccount.user.userId,
            name: currentAccount.user.fullName
          };
          this.props.handleSignIn(currentUser);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      window.location.hash = '#entries';
    }
  }

  handleChange(event) {
    const value = event.target.value;

    const name = event.target.name;

    this.setState({ [name]: value });

  }

  render() {
    const { email, password } = this.state;
    return (
      <div className='sign-up-sign-in'>
        <img className='logo' src='./favicon.ico'/>
        <form onSubmit={this.handleSubmit}>
          <div className='sign-up-div'>
            <input
              placeholder='Email'
                  required
                  type={'text'}
                  name='email'
                  value={email}
                  onChange={this.handleChange}
                  />
            <input
                  placeholder='Password'
                  required
                  type={'password'}
                  name='password'
                  value={password}
                  onChange={this.handleChange}
                  />
          </div>
          <button>Log In</button>
        </form>
        <a href='#signUp'>Create an Account</a>
      </div>
    );
  }
}
