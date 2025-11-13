const pool = require("./pool");
const bcrypt = require("bcryptjs");

async function getUser(username) {
  const { rows } = await pool.query(
    "SELECT * FROM members WHERE username = $1",
    [username]
  );
  if (rows.length !== 0) {
    return rows[0];
  } else {
    return null;
  }
}

async function getUserById(id) {
  const { rows } = await pool.query("SELECT * FROM members WHERE id = $1", [
    id,
  ]);
  return rows[0];
}

async function getPosts(isAuthenticated) {
  if (isAuthenticated) {
    return (
      await pool.query(
        "SELECT title , content , date , CONCAT(firstname,' ',lastname) AS author , author_id FROM posts LEFT JOIN members ON members.id = posts.author_id"
      )
    ).rows;
  } else {
    return (await pool.query("SELECT title , content , date FROM posts")).rows;
  }
}

async function addUser(firstname, lastname, username, password) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  await pool.query(
    "INSERT INTO members(firstname,lastname,username,password) VALUES($1,$2,$3,$4)",
    [firstname, lastname, username, hashedPassword]
  );
}

async function addPost(title, content, author_id) {
  await pool.query(
    "INSERT INTO posts(title,content,date,author_id) VALUES ($1,$2,$3,$4)",
    [title, content, new Date(), author_id || null]
  );
}

module.exports = {
  getUser,
  getUserById,
  getPosts,
  addUser,
  addPost,
};
