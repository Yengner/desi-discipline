import { getErrorMessage } from '@/utils';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)


export async function handleLogin(email, password) {

    try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            throw error;
        }

        return { errorMessage: null }

    } catch (error) {
        return { errorMessage: getErrorMessage(error) }
    }
}

export async function handleSignUp(email, password, userName) {

    try {

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
