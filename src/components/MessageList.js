import React from 'react'
import Ionicon from 'react-ionicons'
import Modal from 'react-modal'

class MessageList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      room: '',
      messages: [],
      newMessage: '',
      udatedMessage: '',
      isOpen: false,
    }

    this.messagesRef = props.database.database().ref('messages')
    // this.getRoomMessages = this.getRoomMessages.bind(this)

    this.roomMessages = []

    this.modalStyle = {
      overlay : {
        position          : 'fixed',
        top               : '25%',
        left              : '40%',
        right             : 0,
        bottom            : 0,
        backgroundColor   : 'rgba(255, 255, 255, 0.75)',
        height            : '325px',
        width             : '350px'
      },
      content : {
        position                   : 'absolute',
        top                        : '40px',
        left                       : '40px',
        right                      : '40px',
        bottom                     : '40px',
        border                     : '1px solid #ccc',
        background                 : '#fff',
        overflow                   : 'auto',
        WebkitOverflowScrolling    : 'touch',
        borderRadius               : '4px',
        outline                    : 'none',
        padding                    : '20px'
      }
    }
  }

  modalOpen(bool) {
    if (bool === true || bool === false) {
      this.setState({isOpen: bool})
    }
    else {
      this.setState({updatedMessage: ''})
      return this.state.isOpen
    }
  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      const message = {
        val: snapshot.val(),
        key: snapshot.key,
      }
      this.setState({messages: this.state.messages.concat(message)})
    })
    this.messagesRef.on('child_removed', snapshot => {
      const idx = this.state.messages.findIndex((msg) => {
        return msg.key === snapshot.key
      })
      if (idx !== -1) {
        this.setState({
          messages: this.state.messages.splice(
              this.state.messages.findIndex(msg => {
                return msg.key === snapshot.key
              }),
              1
        )})
      }
    })
    this.messagesRef.on('child_changed', snapshot => {
      const idx = this.state.messages.findIndex((msg) => {
        return msg.key === snapshot.key
      })
      if (idx !== -1) {
        const msgs = this.state.messages.slice()
        msgs[idx].val.roomId = snapshot.val().roomId
        this.setState({messages: msgs})
      }
    })
  }

  roomFocus(room) {
    if (room) {
      this.setState({ room: room})
      return this.props.roomFocus(room)
    }
    else {
      return this.props.roomFocus()
    }
  }

  getRoomMessages() {
    if (this.roomFocus()) {
      this.roomMessages = this.state.messages.filter(message => {
        return message.val.roomId === this.roomFocus()
      })
    }

    return this.roomMessages || []
  }

  handleNewMessageChange(e) {
    this.setState({newMessage: e.target.value})
  }

  handleUpdatedMessageChange(e) {
    this.setState({updatedMessage: e.target.value})
  }

  handleNewMessageClick() {
    if (!this.state.newMessage) return

    const msg = {
        roomId: this.roomFocus(),
        content: this.state.newMessage,
        sentAt: this.getTime(),
        username: this.props.userName(),
    }
    this.messagesRef.push(msg)
    this.setState({newMessage: ''})
  }

  handleUpdatedMessageClick(e) {
    if (!this.state.updatedMessage) return

    const ref = `messages/${this.roomMessages[this.editMessageIdx].key}`
    this.props.database.database().ref(ref).update({content: this.state.updatedMessage})

    const idx = this.state.messages.findIndex((message) => {
      return message.key === this.roomMessages[this.editMessageIdx].key
    })
    if (idx !== -1) {
      const msgs = this.state.messages.slice()
      msgs[idx].val.content = this.state.updatedMessage
      this.setState({messages: msgs})
    }

    this.setState(
      {
        updatedMessage: '',
        isOpen: false,
      }
    )
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

  handleDeleteMessage(message, index) {
    const key = message.key
    this.messagesRef.child(key).remove()
    const msgs = this.state.messages.slice()
    msgs.splice(
      msgs.findIndex(msg => {
        return msg.key === key
      }), 1
    )
    this.setState({messages: msgs})
  }

  handleEditMessage(message, index) {
    this.editMessageIdx = index
    this.setState({updatedMessage: message.val.content})
    this.modalOpen(true)
  }

  render() {
    if (this.roomFocus()) {
      Modal.setAppElement('#new-room')
      return (
        <div>
          <h3 id="messages-title">Room: {this.roomFocus()}</h3>
          {this.getRoomMessages().map((message, index) => {
            return (
              <div key={`${message.key}-${message.content}`} className="zebra-stripe">
                <span className="bolded">
                  {message.val.username || "Guest" }
                </span>
                <span className="right-justify">{message.val.sentAt}</span>
                <br/>
                <span>{message.val.content}</span>
                <Ionicon className="right-justify" icon="md-trash" onClick={()=>this.handleDeleteMessage(message, index)}></Ionicon>
                <Ionicon className="right-justify" icon="md-create" onClick={()=>this.handleEditMessage(message, index)}></Ionicon>
              </div>
            )
          })}
          <div id="send-message">
            <input
              type="text" id="send-input" value={this.state.newMessage}
              onChange={(e) => this.handleNewMessageChange(e)}
            />
            <button
              id="send-button"
              onClick={(e) => this.handleNewMessageClick(e)}>
              Send
            </button>
          </div>
          <Modal isOpen={this.state.isOpen} contentLabel={'Edit Message'} style={this.modalStyle} className="modal">
            <div onClose={()=>this.modalOpen(false)} className="new-room">
              <div className="modal-header">
                <h3>Change Message</h3>
              </div>
              <div className="modal-body">
                <span>
                  Enter the new message:
                  <br/>
                  <input id="big-text-input" value={this.state.updatedMessage} type="text" onChange={(e)=>this.handleUpdatedMessageChange(e)}/>
                </span>
              </div>
              <div className="modal-footer">
                <button className="btn" onClick={()=>this.modalOpen(false)}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={(e)=>this.handleUpdatedMessageClick(e)}>
                  Ok
                </button>
              </div>
            </div>
          </Modal>
        </div>
      )
    }
    else {
      return <div></div>
    }
  }
}

export default MessageList
