// src/scripts/create-super-user.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function createSuperUser() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    
    const institution = await prisma.educationalInstitution.create({
      data: {
        name: 'Административное учреждение',
        description: 'Автоматически созданное учреждение для администратора',
      },
    });

    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'System',
        role: 'ADMIN',
        institutionId: institution.id,
      },
    });
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }
}