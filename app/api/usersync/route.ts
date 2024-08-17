// import { PrismaClient } from '@prisma/client';
// import { NextResponse } from 'next/server';

// const prisma = new PrismaClient();

// // Test the connection
// prisma.$connect()
//     .then(() => console.log('Connected to the database'))
//     .catch((e) => console.error('Failed to connect to the database', e));

// export async function POST(request: Request) {
//     console.log('user api route hit!')
//     const { clerkId, username, firstName, lastName } = await request.json();

//     try {
//         console.log('creating user in prisma...')
//         const user = await prisma.user.create({
//             data: {
//                 clerkId,
//                 username,
//                 firstName,
//                 lastName,
//             },
//         });

//         return NextResponse.json(user, { status: 201 });
//     } catch (error) {
//         console.error('Error syncing user:', error);
//         return NextResponse.json({ error: 'Error syncing user' }, { status: 500 });
//     }
// }