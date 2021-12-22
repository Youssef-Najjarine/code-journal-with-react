import React from 'react';

export default class Header extends React.Component {
  render() {
    return (
      <header className='column-full row header'>
        <a href='#home'><h1>{this.props.logo}</h1></a>
        <a href='#entries'><h2>Entries</h2></a>
        <a href='#signUp/In'>
          <h2>
            Sign Up/Sign In
            <i className="fas fa-sign-in-alt sign-in-icon"></i>
          </h2>
        </a>
      </header>
    );
  }
}
