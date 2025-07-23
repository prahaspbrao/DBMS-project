import prisma from '../lib/db';

async function main() {
  const user = await prisma.user.findUnique({ where: { id: 1 } });
  if (!user) {
    console.log('User with id=1 not found');
    return;
  }
  const item = await prisma.item.create({
    data: {
      name: 'Test Item',
      description: 'Testing item creation',
      userId: user.id,
      type: 'LOST',
    },
  });
  console.log('Created item:', item);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
