import React from 'react';

export default class Header extends React.Component {

  getSignInClassname(user) {
    return user
      ? 'hidden'
      : '';
  }

  getSignOutClassname(user) {
    return user
      ? ''
      : 'hidden';
  }

  render() {
    const { logo, user, handleSignOut } = this.props;
    return (
      <header className='column-full row header'>
        <a href='#home'><h1>{logo}</h1></a>
        <a href='#entries'><h2>Entries</h2></a>
        <a href='#signUp/In' className={this.getSignInClassname(user)}>
          <h2>
            Sign Up/Sign In
            <i className="fas fa-sign-in-alt sign-in-icon"></i>
          </h2>
        </a>
        <a href='#SignUpOrSignIn' className={this.getSignOutClassname(user)} onClick={() => handleSignOut('currentUser')}>
          <h2>
            Sign Out
            <i className='fas fa-sign-out-alt sign-in-icon'></i>
          </h2>
        </a>
      </header>
    );
  }
}
