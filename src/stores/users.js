import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../../config/supabase";

//
// Pinia store for reused logic/methods
//

export const useUserStore = defineStore("users", () => {
  const user = ref(null);
  const errorMessage = ref("");
  const loading = ref(true);
  const loadingUser = ref(false)

  // Validate email input on sign up
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = async (credentials) => {
    const { email, password } = credentials
    // Check inputs
    if(!validateEmail(email)) {
        return errorMessage.value = "Email is invalid"
    }

    if(!password.length) {
        return errorMessage.value = "Password cannot be empty"
    }
    // Set loading icon until supabase returns something
    loading.value = true;

    const response = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if(response.error) {
        loading.value = false;
        errorMessage.value = response.error.message
    }
    if(response.data.user) {
        loading.value = true;
        const { data: existingUser } = await supabase
        .from("users")
        .select()
        .eq("email", email)
        .single();

        user.value = {
            email: existingUser.email,
            username: existingUser.username,
            id: existingUser.id
        }
    }

  };


    const handleSignup = async (credentials) => {
    const { email, password, username } = credentials;

    if (username.length < 4) { 
      return errorMessage.value = "Username length too short, please provide at least 4 characters";
    }

    if (!validateEmail(email)) {
      return errorMessage.value = "Email is invalid";
    }

    if (password.length < 6) {
      return (errorMessage.value =
        "Password length too short, please provide at least 6 characters");
    }

    loading.value = true;

    const { data: userWithUsernameAlreadyExists } = await supabase
      .from("users")
      .select()
      .eq("username", username)
      .single();

    if (userWithUsernameAlreadyExists) {
      loading.value = false;
      return (errorMessage.value = "User already registered!");
    }

    errorMessage.value = ""; // clear error message once input fields are validated

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      loading.value = false;
      return (errorMessage.value = error.message);
    }

    await supabase.from("users").insert({
      username,
      email,
    });

    const { data: newUser } = await supabase
        .from("users")
        .select()
        .eq("email", email)
        .single();

    user.value = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
    }

    loading.value = false;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    user.value = null;
  };

  const getUser = async () => {
    loadingUser.value = true

    const { data } = await supabase.auth.getUser()

    if(!data.user) {
        loadingUser.value = false;
        return user.value = null;
    }

    const { data: userWithEmail } = await supabase
    .from("users")
    .select()
    .eq("email", data.user.email)
    .single()

    user.value = {
        username: userWithEmail.username,
        email: userWithEmail.email,
        id: userWithEmail.id
    }
    loadingUser.value = false;

  };

  const clearErrorMessage = () => {
    errorMessage.value = "";
  };

  loading.value = false;
  console.log(loading.value);


  // return functions so that they can be used outside of Pinia store. 
  return {
    user,
    errorMessage,
    loadingUser,
    loading,
    handleLogin,
    handleSignup,
    handleLogout,
    getUser,
    clearErrorMessage,
  };
});
