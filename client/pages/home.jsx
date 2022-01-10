import React from 'react';
import ClientError from '../../server/client-error';
export default class Home extends React.Component {
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

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { token } = this.props;
    const { title, photoUrl, notes } = this.state;
    const newEntry = { title, photoUrl, notes };
    if (!title || !photoUrl || !notes) {
      throw new ClientError(400, 'Please enter a valid title, photo Url, and notes.');
    } else {
      fetch('/api/users/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(newEntry)
      })
        .then(response => response.json())
        .then(newEntry => {})
        .catch(error => {
          console.error('Error:', error);
        });
    }
    window.location.hash = '#entries';
  }

  render() {
    const { title, photoUrl, notes } = this.state;
    return (
      <>
        <h2>{!title ? 'New Entry' : title}</h2>
        <form onSubmit={this.handleSubmit}>
        <div className='row'>
          <div className='column-half'>
              <img className='new-entry-img' src={!photoUrl ? '/placeholder-image-square.jpg' : photoUrl}/>
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
          <label>{ !notes ? 'Notes' : ' '}</label>
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
            <div className='new-entry-save-button'>
            <button className='new-entry-save'>Save</button>
          </div>
        </div>
        </form>
      </>
    );
  }
}
