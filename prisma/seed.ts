import { PrismaClient } from '@prisma/client';
import { intervalsData, levelsIntervals } from '../data/exercises/intervals/intervals';

const prisma = new PrismaClient();

async function clearDatabase() {
    await prisma.interval.deleteMany({});
    await prisma.level.deleteMany({});
    await prisma.$executeRaw`ALTER SEQUENCE "Interval_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "Level_id_seq" RESTART WITH 1;`;
}

async function seedIntervals() {
    const levels = await prisma.level.findMany();

    for (const interval of intervalsData) {
        await prisma.interval.create({
            data: {
                name: interval.name,
                halfsteps: interval.halfsteps,
                format: interval.format
            }
        })
    }
}

async function seedLevels() {
    for (const levelInterval of levelsIntervals) {
        const correctIntervals = await prisma.interval.findMany({
            where: {
                AND: [
                    { name: { in: levelInterval.intervals } },
                    { format: { in: levelInterval.format } }
                ]
            }
        });

        const intervalConnections = correctIntervals.map((interval) => ({ id: interval.id }));
        // console.log(`Level ${levelInterval.level} - Intervals to Connect: `, intervalConnections);
        try {
            await prisma.level.create({
                data: {
                    level: levelInterval.level,
                    Intervals: {
                        connect: intervalConnections
                    }
                }
            });
            console.log(`Level ${levelInterval.level} seeded successfully.`);
        } catch (error) {
            console.log(`Failed to seed level ${levelInterval.level}: `, error);
        }
    }
}


async function printLevelsWithIntervals() {
    const levels = await prisma.level.findMany({
        include: {
            Intervals: true
        }
    });
    for (const level of levels) {
        console.log(`Level ${level.level}:`);
        for (const interval of level.Intervals) {
            console.log(`  Interval: ${interval.name}, Halfsteps: ${interval.halfsteps}, Format: ${interval.format}`);
        }
    }
}

async function main() {
    try {
        //clear out previous data
        console.log('Clearing previous data...');
        await clearDatabase();

        //seed intervals data
        console.log('Seeding intervals...');
        await seedIntervals();

        //seed 10 levels and associate exercise presets
        console.log('Seeding levels...');
        await seedLevels();

        console.log('Seeding completed.');

        //print out levels
        // await printLevelsWithIntervals();
    } catch (error) {
        console.error('An error occurred during seed: ', error);
    }

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
