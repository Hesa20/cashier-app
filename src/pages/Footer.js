import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Footer extends Component {
  render() {
    return (
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <div className="container">
          <p className="mb-1">&copy; {new Date().getFullYear()} KasirApp. All rights reserved.</p>
          <small>
            Made with <span style={{ color: '#e25555' }}>&hearts;</span> by Your Name
          </small>
        </div>
      </footer>
    );
  }
}
