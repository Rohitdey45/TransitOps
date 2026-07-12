const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/utils/auth');

const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: 'manager@transitops.com', password: 'password123', name: 'Fleet Manager', role: 'FLEET_MANAGER' },
    { email: 'driver@transitops.com', password: 'password123', name: 'Alex Driver', role: 'DRIVER' },
    { email: 'safety@transitops.com', password: 'password123', name: 'Safety Officer', role: 'SAFETY_OFFICER' },
    { email: 'finance@transitops.com', password: 'password123', name: 'Finance Analyst', role: 'FINANCIAL_ANALYST' },
  ];

  for (const u of users) {
    const hashed = await hashPassword(u.password);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, password: hashed },
    });
  }

  console.log('Seed complete. Demo login: manager@transitops.com / password123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
