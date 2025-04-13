'use server';

import { createSupabaseClient } from '@/utils/supabase/clients/server';
import { getErrorMessage, parseStringify } from '@/utils/utils';
import { redirect } from 'next/navigation';

// Handle Login
export async function handleLogin(email, password) {

    try {
        const supabase = await createSupabaseClient();

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            throw error;
        }
          
          return {
              errorMessage: null,
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token
          }

    } catch (error) {
        return {
            errorMessage: getErrorMessage(error),
            access_token: null
        }
    }
}

// Handle SignUp
export async function handleSignUp(email, password, userName) {

    try {
        const supabase = await createSupabaseClient();

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    userName,
                },
            },
        });


        if (error) {
            console.error("Supabase signUp Error:", error.message, error);
            throw error;
        }

        return { errorMessage: null }

    } catch (error) {
        return { errorMessage: getErrorMessage(error) }
    }

}

// Handle Get User Info
export async function getUserInfo({ userId }) {

    try {
        const supabase = await createSupabaseClient();

        const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        return parseStringify(data);
    } catch (error) {
        return { errorMessage: getErrorMessage(error) }
    }
};

// Handle Get Logged In User
export async function getLoggedInUser() {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
        console.warn('No active user found. Redirecting to /login.');
        redirect('/login');
    }

    const user = await getUserInfo({ userId: data.user.id });
    return user;
}

// Handle SignOut
export async function handleSignOut() {

    try {
        const supabase = await createSupabaseClient();
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw error;
        }

        return { errorMessage: null }

    } catch (error) {

        return { errorMessage: getErrorMessage(error) }

    }
}