import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import RoomList from './components/RoomList'
import MessageList from './components/MessageList'
import * as firebase from 'firebase'

const config = {
    apiKey: "AIzaSyBUHr2EKZIigPukQmKmwvnJL2VXsOiXLvg",
    authDomain: "bloc-chat-angularjs-6e588.firebaseapp.com",
    databaseURL: "https://bloc-chat-angularjs-6e588.firebaseio.com",
    projectId: "bloc-chat-angularjs-6e588",
    storageBucket: "bloc-chat-angularjs-6e588.appspot.com",
    messagingSenderId: "991387445449"
  }
  firebase.initializeApp(config)

class App extends Component {
  constructor(props) {
    super(props)

    console.log("in constructor");
    this.state = {
      room: '',
    }
    console.log("this.state", this.state);

    this.roomFocus = this.roomFocus.bind(this)
  }

  componentWillMount() {
    console.log("componentWillMount(): ", this.state);
  }

  roomFocus(room) {
    console.log("roomFocus():", this.state);
    if (room) {
      console.log("have room param");
      this.setState({room: room})
    }
    else {
      console.log("don't have room param");
      return this.state.room
    }
  }

  render() {
    return (
      <div className="container">
        {/* Left Column */}
        <div className="col_left">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Bloc Chat</h1>
          </header>
          <RoomList database={firebase} roomFocus={this.roomFocus}></RoomList>
        </div>

        {/* Right Column */}
        <div className="col_right">
          <MessageList database={firebase} roomFocus={this.roomFocus}></MessageList>
        </div>
      </div>
    )
  }
}

export default App;
