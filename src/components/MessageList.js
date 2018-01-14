import React from 'react'

class MessageList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      messages: [],
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
      console.log("from db, message state now: ", this.state);
    })
  }

  handleRoomClick() {
    console.log("messages: handleRoomClick(): ", this.props.roomFocus())
    console.log("state: ", this.state);
    let array = []
    if (this.props.roomFocus()) {
      array = this.state.messages.filter(message => {
        console.log("roomId, content: ", message.val.roomId, message.val.content);
        return message.val.roomId === this.props.roomFocus()
      })
    }

    if (!array) array = []
    console.log("messages: handleRoomClick(): array: ", array);
    return array
  }

  render() {
    return (
      <div>
        <h3 id="messages-title">{this.props.roomFocus()}</h3>
        {this.handleRoomClick().map((message, index) => {
          return (
            <div key={message.key} class="zebra-stripe">
              <span className="bolded">{message.val.username}</span>
              <span id="right-justify">{message.val.sentAt}</span>
              <br/>
              <span>{message.val.content}</span>
            </div>
          )
        })}
      </div>
    )
  }
}

export default MessageList
