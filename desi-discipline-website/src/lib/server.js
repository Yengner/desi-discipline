import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


export async function registerUser(email, password) {
  console.log("udiuewhdiouboiueawhdoiwa")


  // Initialize Firebase
  const auth = getAuth();
  console.log("udiuewhdiouboiueawhdoiwa")

  try {
    // Attempt to create a user with the provided email and password.
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User registration successful:", userCredential.user.uid);

    // Return a success object with the user ID.
    return { success: true, userId: userCredential.user.uid };
  } catch (error) {
    // Log the error and return an object containing the error message.
    console.error("Registration error:", error.message);
    return { success: false, errorMessage: error.message };
  }

}  


export async function handleLogin(email, password) {

  try {
      const supabase = await createSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
          throw error;
      }

      return { errorMessage: null }

  } catch (error) {
      return { errorMessage: getErrorMessage(error) }
  }
}
