import React from 'react';

export default class Entries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: []
    };
  }

  componentDidMount() {
    const { token } = this.props;
    fetch('/api/users/:userId/entries', {
      method: 'GET',
      headers: {
        'x-access-token': token
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ entries: data });
      });
  }

  handleEntries() {
    const entries = this.state.entries;
    return entries.map(entry => {
      return <li key={entry.entryId} className='column-full row'>
        <div className='column-third'>
          <img className='entry-img' src={entry.photoUrl} />
        </div>
        <div className='column-third entries-notes'>
          <h3>{entry.title}</h3>
          <p className=''>{entry.notes}</p>
        </div>
        <div className='column-third edit-icon'>
          <a href={`#editEntry?entryId=${entry.entryId}`}><i className="fas fa-pencil-alt pencil-icon"></i></a>
        </div>
      </li>;
    });
  }

  render() {
    return (
      <>
        <div className='row entries-new'>
        <h2>Entries</h2>
        <div>
          <a href='#home'>NEW</a>
        </div>
      </div>
        <ul className='column-full'>
              {this.handleEntries()}
        </ul>
      </>
    );
  }
}
