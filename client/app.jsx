import React from 'react';
import Home from './pages/home';
import Header from './pages/header';
import parseRoute from './lib/parse-route';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      token: null,
      route: parseRoute(window.location.hash)
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
    // const userJSON = window.localStorage.getItem('currentUser');
    // const user = userJSON ? JSON.parse(userJSON).name : null;
    // const token = userJSON ? JSON.parse(userJSON).token : null;
    // this.setState({ user: user, token: token });
  }

  handleSignIn(currentUser) {
    // window.localStorage.setItem('currentUser', JSON.stringify(currentUser));
    // this.setState({ user: currentUser.name, token: currentUser.token });
  }

  handleSignOut(currentUser) {
    // window.localStorage.removeItem(currentUser);
    // this.setState({ user: null, token: null });
  }

  renderPage() {
    const { route } = this.state;
    // const { route, user, token } = this.state;
    if (route.path === 'home') {
      return <Home/>;
    }
  }

  render() {
    return (
      <>
      <Header/>
      <div className='container'>
        <Home/>
      </div>
      </>
    );
  }
}

// http://localhost:3000/
