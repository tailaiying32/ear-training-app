import db from "../../../prisma/db";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";
import { ActionResult } from "next/dist/server/app-render/types";


export async function signup(formData: FormData): Promise<ActionResult> {
    "use server";
    const username = formData.get("username");
    // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
    // keep in mind some database (e.g. mysql) are case insensitive
    if (
        typeof username !== "string" ||
        username.length < 3 ||
        username.length > 31 ||
        !/^[a-z0-9_-]+$/.test(username)
    ) {
        throw new Error('Invalid username!')
    }
    const password = formData.get("password");
    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        throw new Error('Invalid password!')
    }

    const passwordHash = await hash(password, {
        // recommended minimum parameters
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
    const userId = generateIdFromEntropySize(10); // 16 characters long

    const existingUser = await db.user.findUnique({ where: { username } });
    if (existingUser) {
        throw new Error("Username already taken");
    }


    console.log('id: ', userId)
    console.log('username: ', username)
    console.log('password: ', passwordHash)

    const userData = {
        id: userId,
        username: username as string,
        password_hash: passwordHash
    };

    console.log('User data to be inserted:', userData);
    console.log('User data to be inserted:', JSON.stringify(userData, null, 2));


    await db.user.create({
        data: {
            id: userId,
            username: username,
            password_hash: passwordHash
        }
    });


    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/");
}