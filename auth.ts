import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        // to login
        Credentials({
            async authorize(credentials) {
                // parseo y validacion con Zod
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);
                // comparacion de las credenciales
                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    // busqueda de usuario por email
                    const user = await getUser(email);
                    // si el email del usuario no existe retorna null
                    if (!user) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    // si el password es correcto retorna el usuario
                    if (passwordsMatch) {
                        return user;
                    }else{
                        console.log('No match')
                    }
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});