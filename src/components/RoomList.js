import React from 'react'
import Ionicon from 'react-ionicons'
import Modal from 'react-modal'

class RoomList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      rooms: [],
      newRoomId: '',
      udatedMessage: '',
      isOpen: false,
    }

    this.roomsRef = props.database.database().ref('rooms')

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
      this.setState({updatedRoomId: ''})
      return this.state.isOpen
    }
  }

  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      const room = {
        val: snapshot.val(),
        key: snapshot.key,
      }
      this.setState({rooms: this.state.rooms.concat(room)})
    })
  }

  handleRoomClick(index) {
    this.props.roomFocus(this.state.rooms[index].val.roomId)
  }

  handleNewRoomChange(e) {
    this.setState({
      newRoomId: e.target.value,
    })
  }

  handleUpdatedRoomChange(e) {
    this.setState({updatedRoomId: e.target.value})
  }

  handleNewRoomClick() {
    if (!this.state.newRoomId) return

    this.roomsRef.push({roomId: this.state.newRoomId})

    this.props.roomFocus(this.state.newRoomId)
    this.setState({
      newRoomId: '',
    })
  }

  handleUpdatedRoomClick(e) {
    if (!this.state.updatedRoomId) return

    // db for messages
    var ref = this.props.database.database().ref('messages')
    const roomId = this.state.rooms[this.editRoomIdx].val.roomId
    ref.on('child_added', snapshot => {
      const message = {
        val: snapshot.val(),
        key: snapshot.key,
      }
      if (message.val.roomId === roomId) {
        const msgRef = `messages/${message.key}`
        const rm = this.state.updatedRoomId
        this.props.database.database().ref(msgRef).update({roomId: rm})
      }
    })

    // db for room
    ref = `rooms/${this.state.rooms[this.editRoomIdx].key}`
    this.props.database.database().ref(ref).update({roomId: this.state.updatedRoomId})

    // state
    const idx = this.state.rooms.findIndex((room) => {
      return room.key === this.state.rooms[this.editRoomIdx].key
    })
    if (idx !== -1) {
      const rms = this.state.rooms.slice()
      rms[idx].val.roomId = this.state.updatedRoomId
      this.setState({rooms: rms})
    }

    // state change
    this.props.roomFocus(this.state.updatedRoomId)
    this.setState(
      {
        updatedRoomId: '',
        isOpen: false,
      }
    )
  }

  deleteRoom(key) {
    this.roomsRef.child(key).remove()
  }

  deleteMessages(room) {
    var ref = this.props.database.database().ref('messages')
    ref.on('child_added', snapshot => {
      const message = {
        val: snapshot.val(),
        key: snapshot.key,
      }
      if (message.val.roomId === room.val.roomId) {
        ref.child(message.key).remove()
      }
    })
  }

  handleDeleteRoom(room, index) {
    const key = room.key
    this.deleteRoom(key)
    this.deleteMessages(room)
    const rms = this.state.rooms.slice()
    rms.splice(
      rms.findIndex(rm => {
        return rm.key === key
      }), 1
    )
    this.setState(
      {
        rooms: rms,
        newRoomId: '',
        updatedRoomId: '',
      }
    )
    this.props.roomFocus('') // cascade the change
  }

  handleEditRoom(room, index) {
    this.editRoomIdx = index
    this.setState({updatedRoomId: room.val.roomId})
    this.modalOpen(true)
  }

  render() {
    Modal.setAppElement('#root')
    return (
      <div>
        <div id="new-room">
          <input type="text" value={this.state.newRoomId}
            onChange={(e) => this.handleNewRoomChange(e)} />
          <button type="button"
            className="new-room-button"
            onClick={() => this.handleNewRoomClick()}>
            New Room
          </button>
        </div>

        <div>
          <table><tbody>
            {this.state.rooms.map((room, index) => {
              return (
                <tr key={`${room.key}-${room.val.roomId}`}>
                  <td id="each-room" key={`${room.key}-${room.val.roomId}`} onClick={() => this.handleRoomClick(index)}>
                    {room.val.roomId}
                  </td>
                  <td>&nbsp;&nbsp;&nbsp;<Ionicon icon="md-create" onClick={()=>this.handleEditRoom(room, index)} fontSize="24px" /></td>
                  <td>&nbsp;<Ionicon icon="md-trash" onClick={()=>this.handleDeleteRoom(room, index)} fontSize="24px" /></td>
                </tr>
              )
            })}
          </tbody></table>
        </div>
        <Modal isOpen={this.state.isOpen} Label={'Edit Room'} style={this.modalStyle} className="modal">
          <div onClose={()=>this.modalOpen(false)} className="new-room">
            <div className="modal-header">
              <h3>Change Room</h3>
            </div>
            <div className="modal-body">
              <span>
                Enter the new room:
                <br/>
                <input id="big-text-input" value={this.state.updatedRoomId} type="text" onChange={(e)=>this.handleUpdatedRoomChange(e)}/>
              </span>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={()=>this.modalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={(e)=>this.handleUpdatedRoomClick(e)}>
                Ok
              </button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default RoomList
