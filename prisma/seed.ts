import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const password = await hash('password123', 12);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john@example.com',
        username: 'john_doe',
        password,
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane@example.com',
        username: 'jane_smith',
        password,
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        username: 'admin',
        password,
      },
    }),
  ]);

  // Create teams
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: 'Development Team',
        members: {
          create: [
            { userId: users[0].id, role: 'admin' },
            { userId: users[1].id, role: 'member' },
          ],
        },
      },
    }),
    prisma.team.create({
      data: {
        name: 'Design Team',
        members: {
          create: [
            { userId: users[1].id, role: 'admin' },
            { userId: users[2].id, role: 'member' },
          ],
        },
      },
    }),
  ]);

  // Create tasks
  await Promise.all([
    // Development Team Tasks
    prisma.task.create({
      data: {
        title: 'Implement User Authentication',
        content: 'Set up NextAuth.js with email/password and social providers',
        status: 'in-progress',
        priority: 'high',
        assignedToId: users[0].id,
        teamId: teams[0].id,
        subtasks: {
          create: [
            { title: 'Set up NextAuth.js configuration' },
            { title: 'Implement email/password authentication' },
            { title: 'Add social login providers' },
          ],
        },
      },
    }),
    prisma.task.create({
      data: {
        title: 'Create Dashboard UI',
        content: 'Design and implement the main dashboard interface',
        status: 'todo',
        priority: 'medium',
        assignedToId: users[1].id,
        teamId: teams[0].id,
        subtasks: {
          create: [
            { title: 'Design dashboard layout' },
            { title: 'Implement task cards' },
            { title: 'Add team statistics' },
          ],
        },
      },
    }),
    // Design Team Tasks
    prisma.task.create({
      data: {
        title: 'Design System Implementation',
        content: 'Create and document the design system for the application',
        status: 'completed',
        priority: 'high',
        assignedToId: users[1].id,
        teamId: teams[1].id,
        subtasks: {
          create: [
            { title: 'Create color palette', completed: true },
            { title: 'Design component library', completed: true },
            { title: 'Document usage guidelines', completed: true },
          ],
        },
      },
    }),
    prisma.task.create({
      data: {
        title: 'User Interface Mockups',
        content: 'Create high-fidelity mockups for all main screens',
        status: 'in-progress',
        priority: 'medium',
        assignedToId: users[2].id,
        teamId: teams[1].id,
        subtasks: {
          create: [
            { title: 'Design login/register screens' },
            { title: 'Create dashboard mockups' },
            { title: 'Design task management interface' },
          ],
        },
      },
    }),
  ]);

  console.log('Database has been seeded! 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 