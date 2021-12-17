import React from 'react';

export default class Home extends React.Component {
  render() {
    return (
      <main>
        <h2>New Entry</h2>
        <form>
        <div className='row'>
          <div className='column-half'>
            <img src='/placeholder-image-square.jpg'/>
          </div>

          <div className='column-half'>
            <div className='new-entry-input'>
              <label>Title</label>
              <input
                    required
                    type='text'
                    name='title'
                     // onChange={this.handleChange}
                    // value={this.state.mealDescription}
              />
            </div>

              <div className='new-entry-input'>
              <label>Photo URL</label>
              <input
                      required
                     type='text'
                     name='photoUrl'
                      // onChange={this.handleChange}
                     // value={this.state.mealDescription}
              />
            </div>

          </div>
        </div>
        <div className='notes-div'>
          <label>Notes</label>
          <textarea
                    required
                    rows="9"
                    className="column-full"
                    id="notes"
                    name="notes"
                    type="text"
            // onChange={this.handleChange}
            // value={this.state.mealDescription}
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
