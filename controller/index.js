const { queryDb } = require("../helper/adminHelper");

const jwt = require('jsonwebtoken');  // Import the JWT library

const JWT_SECRET = 'sushma';
const generateJWT = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });  
};
const moment = require('moment');
const time = moment().format("YYYY-MM-DD HH:mm:ss"); 

exports.Registration = async (req, res) => {
    const { username, email, mobile_no, set_password, confirm_password } = req.body;
    if (!username || !email || !mobile_no || !set_password || !confirm_password) {
        return res.status(400).json({ msg: 'All fields are required' });
    }
    try {
        const procedureQuery = `INSERT INTO registration (username, email, mobile_no, set_password ,confirm_password)
        VALUES (?, ?, ?, ?, ?)   `;
        const result = await queryDb(procedureQuery, [username, email, mobile_no, set_password, confirm_password]);
        const userId = result.insertId;
        const token = generateJWT(userId);
        return res.status(200).json({
            msg: "Registered successfully",
            userId: userId,
            token: token 
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: e.sqlMessage || "Something went wrong in the API call." });
    }
};
exports.Login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(201).json({ msg: 'email and password are required' });
    }
    try {
        const query = 'SELECT * FROM Registration WHERE email = ?';
        const login = await queryDb(query, [email]);
        if (login.length === 0) {
            return res.status(201).json({ msg: 'User not registered' });
        }
        const user = login[0];
        if (password !== user.set_password) {
            return res.status(201).json({ msg: 'Invalid email or password' });
        }
        const token = generateJWT(user.id);
        return res.status(200).json({
            msg: 'Login SuccessFully.',
            token: token, 
            user: {
                id: user.id,
                username: user.username,
                set_password:user.set_password
            },
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: 'Something went wrong in the API call' });
    }
};

exports.Profile = async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) {
        return res.status(201).json({ msg: 'UserId are required' });
    }
  try {
      const procedureQuery = 'SELECT id , mobile_no , username ,set_password , email FROM registration'; 
      const result = await queryDb(procedureQuery);
      if (result.length === 0) {
          return res.status(404).json({ msg: "No users found" });
      }
      return res.status(200).json({ msg: "Users retrieved successfully", data: result });
  } catch (e) {
      console.error(e);
      return res.status(500).json({ msg: e.sqlMessage || "Something went wrong in the API call." });
  }
};


exports.AddPost = async (req, res) => {
    const { user_id, title , image , time ,post } = req.body;
    try {
        const postQuery = `INSERT INTO post (user_id , post, title, image, time) VALUES (?,?,?,?,?)`;
        const result = await queryDb(postQuery, [user_id , post, title, image, time]);
        return res.status(200).json({ result, msg: 'Post added successfully' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: 'Something went wrong while adding the contact' });
    }
};

exports.GetPost = async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) {
        return res.status(201).json({ msg: 'UserId are required' });
    }
    try {
        const procedureQuery = 'SELECT post_id, post ,title ,image ,time FROM post WHERE user_id = ?'; 
        const result = await queryDb(procedureQuery, [user_id]);
        if (result.length === 0) {
            return res.status(201).json({ msg: "No Post found for this UserId Please add the post" });
        }
        return res.status(200).json({ msg: "Post retrieved successfully", data: result });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: e.sqlMessage || "Something went wrong in the API call." });
    }
};



exports.addComment = async (req, res) => {
    const { user_id, post_id, comment } = req.body;
    if (!user_id|| !post_id || !comment) {
        return res.status(400).json({ msg: 'All Field are required' });
    }
    try {
        const query = 'INSERT INTO comment (user_id, post_id, comment, time) VALUES (?, ?, ?, ?)';
        await queryDb(query, [user_id, post_id, comment, time]); 
        return res.status(200).json({
            msg: 'Comment send successfully',
            message: { user_id, post_id, comment,time }
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: 'Something went wrong while sending the message' });
    }
};


exports.CommentList = async (req, res) => {
    const { user_id, post_id } = req.body;
    if (!user_id|| !post_id) {
        return res.status(400).json({ msg: 'All Field are required' });
    }
    try {
        const procedureQuery = `
            SELECT comment_id, user_id, post_id, comment , time
            FROM comment
            WHERE post_id = ? AND user_id = ?`; 
       const result = await queryDb(procedureQuery, [post_id, user_id]);
        if (result.length === 0) {
            return res.status(201).json({ msg: "No messages found" });
        }
        return res.status(200).json({ msg: "Comment retrieved successfully", data: result });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: e.sqlMessage || "Something went wrong in the API call." });
    }
};






