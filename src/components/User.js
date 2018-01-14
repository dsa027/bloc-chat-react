import React from 'react'

class User extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      signedOn: false,
    }
  }

  signOnOff() {
    console.log("signOnOff");
    if (this.state.signedOn) {
      this.props.database.auth().signOut()
      this.props.userName(null)
      this.setState({signedOn: false})
    }
    else {
      const provider = new this.props.database.auth.GoogleAuthProvider()
      this.props.database.auth().signInWithPopup(provider)
          .then(result => {
            this.props.userName(result.user.displayName)
            this.setState({signedOn: true})
          })
    }
  }

  render() {
    return (
      <div>
        <p>
          {this.props.userName()}
          <button type="button" className="new-room-button" onClick={() => this.signOnOff()}>
            {this.props.userName() ? "Not Me" : "Sign On"}
          </button>
        </p>
      </div>
    )
  }
}

  export default User
