import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;
if (!secret) {
  console.error('JWT_SECRET não está definido no arquivo .env');
  process.exit(1);
}

const token = jwt.sign({ id: 'user-id-teste' }, secret, { expiresIn: '1h' });
console.log('Token JWT gerado:', token);