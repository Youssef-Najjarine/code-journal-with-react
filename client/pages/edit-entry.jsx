import React from 'react';
import ClientError from '../../server/client-error';
export default class EditEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      photoUrl: '',
      notes: '',
      entryId: 0,
      deleteEntryModal: false,
      token: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEntryDelete = this.handleEntryDelete.bind(this);
  }

  componentDidMount() {
    const { token, entryId } = this.props;
    this.setState({ token: token });
    fetch(`/api/entries/${entryId}`, {
      method: 'GET',
      headers: {
        'x-access-token': token
      }
    })
      .then(response => response.json())
      .then(data => {
        const [entry] = data;
        this.setState({
          title: entry.title,
          photoUrl: entry.photoUrl,
          notes: entry.notes,
          entryId: entry.entryId
        });
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
      fetch(`/api/entries/${entryId}`, {
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

  handleEntryDelete() {
    const { entryId, token } = this.state;
    fetch(`/api/entries/${entryId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    });
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
              <input onClick={() => this.setState({ deleteEntryModal: true })} className='delete-entry' type={'button'} value={'Delete Entry'}/>
              <button className="new-entry-save">Save</button>
            </div>
          </div>
        </form>
        <div className={this.state.deleteEntryModal ? 'black-box' : 'black-box hidden'}>
          <div className="white-box">
            <h2>Are you sure you want to delete this entry?</h2>
            <div className='row cancel-confirm-div'>
              <button onClick={() => this.setState({ deleteEntryModal: false })} className='cancel-delete'>cancel</button>
              <button onClick={this.handleEntryDelete} className='confirm-delete'>confirm</button></div>
          </div>
        </div>
      </main>
    );
  }
}
