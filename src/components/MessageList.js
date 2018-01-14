import React from 'react'

class MessageList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      messages: [],
      newMessage: '',
    }

    this.messagesRef = props.database.database().ref('messages')

    this.handleRoomClick = this.handleRoomClick.bind(this)
  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      const message = {
        val: snapshot.val(),
        key: snapshot.key,
      }
      this.setState({messages: this.state.messages.concat(message)})
    })
  }

  handleRoomClick() {
    let array = []
    if (this.props.roomFocus()) {
      array = this.state.messages.filter(message => {
        return message.val.roomId === this.props.roomFocus()
      })
    }

    if (!array) array = []
    return array
  }

  handleMessageChange(e) {
    this.setState({newMessage: e.target.value})
  }

  handleMessageClick() {
    if (!this.state.newMessage) return

    const msg = {
        roomId: this.props.roomFocus(),
        content: this.state.newMessage,
        sentAt: this.getTime(),
        username: this.props.userName(),
    }
    this.messagesRef.push(msg)
    this.setState({newMessage: ''})
  }

  doubleDigit(number) {
    return (number < 10) ? "0" + number : number
  }

  getTime() {
    const date = new Date();
    let hours = date.getHours()
    let ampm = hours >= 12 ? "PM" : "AM"
    hours = hours > 12 ? hours - 12 : hours

    return (
        hours +
        ":" +
        this.doubleDigit(date.getMinutes()) +
        ampm
    )
  }

  render() {
    if (this.props.roomFocus()) {
      return (
        <div>
          <h3 id="messages-title">{this.props.roomFocus()}</h3>
          {this.handleRoomClick().map((message, index) => {
            return (
              <div key={message.key} className="zebra-stripe">
                <span className="bolded">
                  {message.val.username ? message.val.username : "Guest" }
                </span>
                <span id="right-justify">{message.val.sentAt}</span>
                <br/>
                <span>{message.val.content}</span>
              </div>
            )
          })}
          <div id="send-message">
            <input
              type="text" id="send-input" value={this.state.newMessage}
              onChange={(e) => this.handleMessageChange(e)}
            />
            <button
              id="send-button"
              onClick={(e) => this.handleMessageClick(e)}>
              Send
            </button>
          </div>
        </div>
      )
    }
    else {
      return <div></div>
    }
  }
}

export default MessageList
