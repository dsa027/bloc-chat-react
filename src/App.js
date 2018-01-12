import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import RoomList from './components/RoomList'
import * as firebase from 'firebase'

var config = {
    apiKey: "AIzaSyBUHr2EKZIigPukQmKmwvnJL2VXsOiXLvg",
    authDomain: "bloc-chat-angularjs-6e588.firebaseapp.com",
    databaseURL: "https://bloc-chat-angularjs-6e588.firebaseio.com",
    projectId: "bloc-chat-angularjs-6e588",
    storageBucket: "bloc-chat-angularjs-6e588.appspot.com",
    messagingSenderId: "991387445449"
  }
  firebase.initializeApp(config)

class App extends Component {
  render() {
    return (
      <div className="container">
        {/* Left Column */}
        <div className="col_left">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Bloc Chat</h1>
          </header>
          <RoomList database={firebase}></RoomList>
        </div>

        {/* Right Column */}
        <div className="col_right">
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
      </div>
    );
  }
}

export default App;
