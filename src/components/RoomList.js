import React from 'react'
import Ionicon from 'react-ionicons'

class RoomList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      rooms: [],
      newRoomName: '',
    }

    this.roomsRef = props.database.database().ref('rooms')
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
    this.props.roomFocus(this.state.rooms[index].val)
  }

  handleNewRoomChange(e) {
    this.setState({
      newRoomName: e.target.value,
    })
  }

  handleNewRoomAdd() {
    if (!this.state.newRoomName) return

    this.roomsRef.push(this.state.newRoomName)
    this.setState({
      newRoomName: '',
    })
  }

  render() {
    return (
      <div>
        <div id="new-room">
          <input type="text" value={this.state.newRoomName}
            onChange={(e) => this.handleNewRoomChange(e)} />
          <button type="button"
            className="new-room-button"
            onClick={() => this.handleNewRoomAdd()}>
            New Room
          </button>
        </div>

        <div>
          <table><tbody>
            {this.state.rooms.map((room, index) => {
              return (
                <tr key={room.key}>
                  <td id="each-room" key={room.key} onClick={() => this.handleRoomClick(index)}>
                    {room.val}
                  </td>
                  <td>&nbsp;&nbsp;&nbsp;<Ionicon icon="md-create" fontSize="18px" /></td>
                  <td>&nbsp;<Ionicon icon="md-trash" fontSize="18px" /></td>
                </tr>
              )
            })}
          </tbody></table>
        </div>
      </div>
    )
  }
}

export default RoomList
