import React from 'react';
import ClientError from '../../server/client-error';

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      birthday: '',
      gender: 'Male',
      maleIsChecked: true,
      femaleIsChecked: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    if (name === 'gender') {
      if (value === 'Male') {
        this.setState({ maleIsChecked: !this.state.maleIsChecked, femaleIsChecked: false });
      } else if (value === 'Female') {
        this.setState({ femaleIsChecked: !this.state.femaleIsChecked, maleIsChecked: false });

      }
    }

    return this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { firstName, lastName, email, password, birthday, gender } = this.state;
    const newAccount = { firstName, lastName, email, password, birthday, gender };
    if (!firstName || !lastName || !email || !password || !birthday || !gender) {
      throw new ClientError(400, 'Please enter a valid firstName, lastName, email, password, birthday, and gender.');
    } else {

      fetch('/api/users/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAccount)
      })
        .then(response => response.json())
        .then(newAccount => { })
        .catch(error => {
          console.error('Error:', error);
        });
      window.location.hash = '#entries';
    }
  }

  render() {
    return (
      <div className='create-account'>
        <h2>Create an account</h2>
        <h6>It&apos;s free and always will be.</h6>
        <form onSubmit={this.handleSubmit}>
          <div className='create-account-name'>
            <input
              className='column-quarter'
              placeholder='First Name'
              required
              type={'text'}
              name='firstName'
              onChange={this.handleChange}
              value={this.state.firstName}
            />
            <input
              className='column-quarter'
              placeholder='Last Name'
              required
              type={'text'}
              name='lastName'
              onChange={this.handleChange}
              value={this.state.lastName}
            />
          </div>
        <div className='create-account-email-password'>
          <input
            className='column-half'
            placeholder='Email'
            required
            type={'email'}
            name='email'
              onChange={this.handleChange}
              value={this.state.email}
          />
          <input
              className='column-half'
              placeholder='Password'
              required
              type={'password'}
              name='password'
              onChange={this.handleChange}
              value={this.state.password}
          />
        </div>
        <div>
          <h6>Birthday</h6>
            <input
              type="date"
              id="birthday"
              name="birthday"
              onChange={this.handleChange}
              value={this.state.birthday}
              />
        </div>
        <div className='gender-div'>
            <label className='genders'>
              <input type="checkbox"
                      id="male"
                      name="gender"
                      value="Male"
                      checked={this.state.maleIsChecked}
                      onChange={this.handleChange}
              />
              Male
            </label>
            <label className='genders'>
              <input type="checkbox"
                      id="female"
                      name="gender"
                      value="Female"
                      checked={this.state.femaleIsChecked}
                      onChange={this.handleChange}
                      />
              Female
            </label>
        </div>
          <button>Create an account</button>
        </form>
        <a href='#signUp/In'>Sign In</a>
      </div>
    );
  }
}
