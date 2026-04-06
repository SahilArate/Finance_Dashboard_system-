import bcrypt from 'bcryptjs';
import prisma from './utils/prisma';

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@finance.com' },
  });

  if (existingAdmin) {
    console.log('Admin already exists!');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@finance.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin created successfully!', admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());