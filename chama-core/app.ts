import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

// Import routes
import savingGroupRouter from './routes/saving-group.routes';
import authRouter from './routes/auth.routes';
import userRouter from './routes/users.routes';

// Initialize dotenv to load environment variables
dotenv.config();

// Setup database connection
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}
const sql = neon(process.env.DATABASE_URL);

// Initialize Express app
const app = express();

// Use routes
app.use('/api/v1/saving-groups', savingGroupRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Chama API is running successfully :)');
});

// Database version endpoint
app.get('/db-version', async (req: Request, res: Response) => {
  try {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    res.status(200).send(version);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Error connecting to database');
  }
});

// Set port and start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running successfully on port ${PORT}`);
});

export default app;
