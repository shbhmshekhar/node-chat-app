const users = [];

const addUser = ({ id, username, room }) => {
  //Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //Validate data
  if (!username || !room) {
    return { error: 'Username and Room are required' };
  }

  //check for existing user

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  //validate username
  if (existingUser) {
    return { error: `Username ${username} already taken` };
  }

  //Store User
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    const removedUser = users.splice(index, 1)[0];
    return removedUser;
  }
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
