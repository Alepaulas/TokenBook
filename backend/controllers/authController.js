import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const users = [];

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = users.find((user) => user.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já registrado!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { id: Date.now(), username, email, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar usuário', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta!' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({ message: 'Login realizado com sucesso!', token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};
