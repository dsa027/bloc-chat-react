import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import RoomList from './components/RoomList'
import MessageList from './components/MessageList'
import User from './components/User'
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

    this.state = {
      room: '',
      username: null,
    }

    this.roomFocus = this.roomFocus.bind(this)
    this.userName = this.userName.bind(this)
  }

  componentWillMount() {
  }

  roomFocus(room) {
    if (room || room === '') {
      this.setState({ room: room})
    }
    else {
      return this.state.room
    }
  }

  userName(username) {
    if (username || username === null) {
      this.setState({username: username})
    }
    else {
      return this.state.username || "Guest"
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
          <User database={firebase} userName={this.userName}></User>
          <RoomList database={firebase} roomFocus={this.roomFocus}></RoomList>
        </div>

        {/* Right Column */}
        <div className="col_right">
          <MessageList
            database={firebase} roomFocus={this.roomFocus} roomId={this.state.room}
            userName={this.userName}>
          </MessageList>
        </div>
      </div>
    )
  }
}

export default App
