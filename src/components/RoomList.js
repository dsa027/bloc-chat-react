import React from 'react'

class RoomList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      rooms: [],
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

  handleClick(index) {
    console.log("clicked: ", this.state.rooms[index]);
  }

  render() {
    return (
      <div>
        {this.state.rooms.map((room, index) => {
          return (
            <p
              key={room.key}
              onClick={() => this.handleClick(index)}
            >
              {room.val}
            </p>
          )
        })}
      </div>
    )
  }
}

export default RoomList
