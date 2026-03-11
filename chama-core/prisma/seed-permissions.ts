/**
 * Standalone seed script to populate permissions and create default roles
 * for all existing chamas that don't have them yet.
 *
 * Run with: npx ts-node prisma/seed-permissions.ts
 */
import { PrismaClient, system_role } from '@prisma/client';
import {
  DEFAULT_PERMISSIONS,
  DEFAULT_ROLES,
} from '../src/roles-permissions/roles-permissions.constants';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding permissions...');

  // 1. Upsert all global permissions
  for (const perm of DEFAULT_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: { description: perm.description },
      create: { key: perm.key, description: perm.description },
    });
  }
  console.log(`  ✓ ${DEFAULT_PERMISSIONS.length} permissions seeded`);

  const allPermissions = await prisma.permission.findMany();
  const permKeyToId = new Map(allPermissions.map((p) => [p.key, p.id]));

  // 2. For every existing chama, create default roles if missing
  const chamas = await prisma.chama.findMany({ select: { id: true, created_by: true } });
  console.log(`  Found ${chamas.length} chamas`);

  for (const chama of chamas) {
    for (const roleDef of DEFAULT_ROLES) {
      const existing = await prisma.role.findUnique({
        where: { chama_id_name: { chama_id: chama.id, name: roleDef.name } },
      });
      if (existing) continue;

      const permissionIds = roleDef.permissions
        .map((key) => permKeyToId.get(key))
        .filter((id): id is string => !!id);

      await prisma.role.create({
        data: {
          chama_id: chama.id,
          name: roleDef.name,
          description: roleDef.description,
          is_default: true,
          role_permissions: {
            create: permissionIds.map((pid) => ({ permission_id: pid })),
          },
        },
      });
    }
    console.log(`  ✓ Default roles created for chama ${chama.id}`);

    // 3. Set creator's system_role to OWNER if not already set
    await prisma.user.update({
      where: { id: chama.created_by },
      data: { system_role: system_role.OWNER },
    });

    // 4. Assign creator "Chairperson" org role if no member_role exists
    const existingMemberRole = await prisma.member_role.findUnique({
      where: {
        user_id_chama_id: { user_id: chama.created_by, chama_id: chama.id },
      },
    });
    if (!existingMemberRole) {
      const chairpersonRole = await prisma.role.findUnique({
        where: {
          chama_id_name: { chama_id: chama.id, name: 'Chairperson' },
        },
      });
      if (chairpersonRole) {
        await prisma.member_role.create({
          data: {
            user_id: chama.created_by,
            chama_id: chama.id,
            role_id: chairpersonRole.id,
          },
        });
      }
    }

    // 5. Assign "General Member" to all other members without a role
    const memberships = await prisma.membership.findMany({
      where: { chama_id: chama.id },
      select: { user_id: true },
    });

    const generalMemberRole = await prisma.role.findUnique({
      where: {
        chama_id_name: { chama_id: chama.id, name: 'General Member' },
      },
    });

    if (generalMemberRole) {
      for (const membership of memberships) {
        const existingRole = await prisma.member_role.findUnique({
          where: {
            user_id_chama_id: {
              user_id: membership.user_id,
              chama_id: chama.id,
            },
          },
        });
        if (!existingRole) {
          await prisma.member_role.create({
            data: {
              user_id: membership.user_id,
              chama_id: chama.id,
              role_id: generalMemberRole.id,
            },
          });
        }
      }
    }
  }

  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
