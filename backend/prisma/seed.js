const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/utils/auth');

const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: 'dev@transitops.com', password: 'password123', name: 'Fleet Manager', role: 'FLEET_MANAGER' },
    { email: 'mark@transitops.com', password: 'password123', name: 'Alex Driver', role: 'DRIVER' },
    { email: 'ben@transitops.com', password: 'password123', name: 'Safety Officer', role: 'SAFETY_OFFICER' },
    { email: 'tom@transitops.com', password: 'password123', name: 'Finance Analyst', role: 'FINANCIAL_ANALYST' },
  ];

  fo r(const u of users) {
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
