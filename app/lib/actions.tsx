'use server';       // server actions
import { z } from 'zod'
import { sql } from "@vercel/postgres";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({ invalid_type_error: 'Please select a customer.' }),
    amount: z.coerce    // convierte amount<string> a <number>
        .number({ invalid_type_error: 'El monto no es un numero', required_error: 'El monto es requerido' })
        .gt(0, { message: 'Please enter an amount greater than $0.' })
        .max(100, { message: 'El monto debe ser menor a 100' }),
    status: z.enum(['pending', 'paid'], { invalid_type_error: 'Please select an invoice status.' }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
    // safeParse => validate form fields using Zod
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date}) `;

    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    // Once the database has been updated, the /dashboard/invoices path will be revalidated, and fresh data will be fetched from the server.
    // revalidatePath('/dashboard/invoices'); // to refresh data
    redirect('/dashboard/invoices');    // to redirect to another page

}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, prevState: State, formData: FormData) {

    const validateForm = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validateForm.success) {
        console.log(validateForm.error.flatten().fieldErrors);
        return {
            errors: validateForm.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validateForm.data;

    const amountInCents = amount * 100;
    try {
        await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;

    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Invoice.',
        };
    }

    revalidatePath('/dashboard/invoices');  //  to clear the client cache and make a new server request.
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };

    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}
