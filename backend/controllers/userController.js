const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
  } catch (err) {
    res.status(500).json({ message: 'Fehler bei der Benutzerregistrierung', error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'Benutzername oder Passwort falsch' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Benutzername oder Passwort falsch' });
    }

    const token = jwt.sign({ username: user.username }, 'deinGeheimerSchlüssel', { expiresIn: '1h' });

    res.status(200).json({ message: 'Erfolgreich angemeldet', token });
  } catch (err) {
    res.status(500).json({ message: 'Fehler bei der Anmeldung', error: err.message });
  }
};

const getUserProfile = async (req, res) => {
  const { username } = req.user; 
  
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    res.status(200).json({ username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Abrufen des Profils', error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
