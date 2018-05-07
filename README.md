---
title: Bloc-Chat-React
summary: A Web-based, SPA chat room application written in React
tech: React, Firebase, Node.js, JavaScript, HTML/CSS, Ion Icons, Heroku, GitHub
---
[1]: https://bloc-chat-react-dsa027.herokuapp.com/
[2]: /assets/img/posts/bloc_chat_react_logo_thumb.png
[![Heroku Site][2]][1]

# Summary

  Chat rooms written in React.

# Explanation

  The front page is the only page, even in the SPA "page" sense. On the left is a narrow column with 1) a button to sign in using `GoogleAuthProvider`, 2) an input to create a new room, and 3) a list of rooms with buttons to edit and delete next to each room. Deleting a room will also delete all the messages in the room. Editing the name of a room will keep the messages with the room. There's no authorization, so anyone can add, edit and delete rooms.

  Clicking on a room name will open the room's chat messages onto the right-hand side of the screen. There's an input box that stays at the bottom of the screen for entering a text message. If you're signed in, your name will appear with the message, otherwise, "Guest" will appear.

  In the message list, there are edit and delete buttons. Again, anyone can add, edit and delete messages.

  The application is generally broken down by
  - Main: App.js has both a RoomList tag and a MessageList tag
  - RoomList: the list of rooms that have been created
  - MessageList: the list of messages attached to the selected room

# Problem

  This was my second React project, Bloc Jams React being the first, so I was already a bit familiar with React. However, I quickly found out that I still didn't know a heck of a lot. This application is interesting in the interplay between children and parents and siblings and helped me grow my understanding of React.

# Solution

  This project shows the practical application of several technologies:
  - React: the entire application is written for React
  - Firebase
  - Node.js
  - JavaScript
  - HTML/CSS
  - Ion Icons
  - Heroku
  - GitHub

# Results

  Sereral enhancements could be made:
  - Admin users
  - Private rooms
  - See if someone else is online in the same room
  - See if someone else is typing in the same room

# Conclusion

  ToDos
  - Enhancements and bug fixes
