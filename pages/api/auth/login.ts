import type { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';

dotenv.config();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
  const adminName = process.env.ADMIN_NAME || 'System Administrator';

  const staffUsername = 'factory';
  const staffPassword = 'factory2026';

  const reqUser = String(username).trim().toLowerCase();

  if (reqUser === adminUsername.toLowerCase() && password === adminPassword) {
    return res.json({
      success: true,
      user: {
        id: 'u1',
        username: adminUsername.toLowerCase(),
        role: 'admin',
        name: adminName,
      },
    });
  } else if (reqUser === staffUsername && password === staffPassword) {
    return res.json({
      success: true,
      user: {
        id: 'u2',
        username: 'factory',
        role: 'staff',
        name: 'Production Manager',
      },
    });
  }

  return res.status(401).json({ success: false, error: 'Invalid username or password' });
}
