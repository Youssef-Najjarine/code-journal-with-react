import React from 'react';
import ClientError from '../../server/client-error';
export default class EditEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      photoUrl: '',
      notes: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { token, entryId } = this.props;
    fetch(`/api/entries/${entryId}`, {
      method: 'GET',
      headers: {
        'x-access-token': token
      }
    })
      .then(response => response.json())
      .then(data => {
        const [entry] = data;
        this.setState({ title: entry.title, photoUrl: entry.photoUrl, notes: entry.notes });
      });
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { token, entryId } = this.props;
    const { title, photoUrl, notes } = this.state;
    const updatedEntry = { title, photoUrl, notes };
    if (!title || !photoUrl || !notes) {
      throw new ClientError(400, 'Please enter a valid title, photo Url, and notes.');
    } else {
      fetch(`/api/meals/${entryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(updatedEntry)
      })
        .then(response => response.json())
        .then(updatedEntry => { })
        .catch(error => {
          console.error('Error:', error);
        });
    }
    window.location.hash = '#entries';
  }

  render() {
    const { title, photoUrl, notes } = this.state;
    return (
      <main>
        <h2>{!title ? 'Edit Entry' : title}</h2>
        <form onSubmit={this.handleSubmit}>
          <div className='row'>
            <div className='column-half'>
              <img className='new-entry-img' src={!photoUrl ? '/placeholder-image-square.jpg' : photoUrl} />
            </div>

            <div className='column-half'>
              <div className='new-entry-input'>
                <label>Title</label>
                <input
                  required
                  type='text'
                  name='title'
                  placeholder='New Entry...'
                  onChange={this.handleChange}
                  value={this.state.title}
                />
              </div>

              <div className='new-entry-input'>
                <label>Photo URL</label>
                <input
                  required
                  type='text'
                  name='photoUrl'
                  onChange={this.handleChange}
                  value={this.state.photoUrl}
                />
              </div>

            </div>
          </div>
          <div className='notes-div'>
            <label>{!notes ? 'Notes' : ' '}</label>
            <textarea
              required
              rows="9"
              className="column-full"
              id="notes"
              name="notes"
              type="text"
              onChange={this.handleChange}
              value={this.state.notes}
            >
            </textarea>
            <div className='new-entry-save-div'>
              <button className='new-entry-save'>Save</button>
            </div>
          </div>
        </form>
      </main>
    );
  }
}
