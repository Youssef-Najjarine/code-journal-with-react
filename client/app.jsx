import React from 'react';
import Home from './pages/home';
import Header from './pages/header';
import parseRoute from './lib/parse-route';
import Entries from './pages/entries';
import EditEntry from './pages/edit-entry';
import SignUpSignIn from './pages/sign-up-sign-in';
import SignUp from './pages/sign-up';
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
    const userJSON = window.localStorage.getItem('currentUser');
    const user = userJSON ? JSON.parse(userJSON).name : null;
    const token = userJSON ? JSON.parse(userJSON).token : null;
    this.setState({ user: user, token: token });
  }

  handleSignIn(currentUser) {
    window.localStorage.setItem('currentUser', JSON.stringify(currentUser));
    this.setState({ user: currentUser.name, token: currentUser.token });
  }

  handleSignOut(currentUser) {
    window.localStorage.removeItem(currentUser);
    this.setState({ user: null, token: null });
  }

  renderPage() {
    const { route, user, token } = this.state;
    const entryId = route.params.get('entryId');
    if (route.path === 'signUp') {
      return <SignUp />;
    } else if (!user || route.path === 'signUp/In') {
      return <SignUpSignIn handleSignIn={this.handleSignIn}/>;
    } else if (route.path === 'home' || route.path === '') {
      return <Home token={token}/>;
    } else if (route.path === 'entries') {
      return <Entries token={token}/>;
    } else if (route.path === 'editEntry') {
      return <EditEntry token={token} entryId={entryId}/>;
    }
  }

  render() {

    return (
      <>
        <Header logo='Blog Journal' user={this.state.user} handleSignOut={this.handleSignOut}/>
      <div className='container'>
        <main>
          { this.renderPage() }
        </main>
      </div>
      </>
    );
  }
}

// http://localhost:3000/
