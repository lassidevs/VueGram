<script setup>
import Container from "./Container.vue";
import UserBar from "./UserBar.vue";
import ImageGallery from "./ImageGallery.vue";
import { ref, reactive, onMounted, watch } from "vue";
import { supabase } from "../../config/supabase";
import { useRoute } from "vue-router";
import { useUserStore } from "../stores/users"
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { user: loggedInUser } = storeToRefs(userStore)

const loading = ref(false);
const posts = ref([]);
const userInfo = reactive({
    posts: null,
    followers: null,
    following: null
})

const addNewPost = (post) => {
    posts.value.unshift(post)
}

const route = useRoute();
// Check username from url params. 
const { username } = route.params;

const user = ref(null);
const isFollowing = ref(false);

const updateIsFollowing = (follow) => {
    isFollowing.value = follow
}

const fetchData = async () => {
    loading.value = true;
    const { data: userData } = await supabase
        .from("users")
        .select()
        .eq('username', username)
        .single();

    if (!userData) {
        loading.value = false;
        return user.value = null;
    }

    user.value = userData


    const { data: postsData } = await supabase
        .from("posts")
        .select()
        .eq('owner_id', user.value.id)

    posts.value = postsData;

    const followerCount = await fetchFollowersCount();
    const followingCount = await fetchFollowingCount();

    userInfo.followers = followerCount;
    userInfo.following = followingCount;
    userInfo.posts = posts.value.length;

    loading.value = false;
}

const fetchFollowersCount = async () => {
    const {count} = await supabase
        .from("followers_following")
        .select("*", {count: 'exact'})
        .eq("following_id", user.value.id)

        return count
}

const fetchFollowingCount = async () => {
    const {count} = await supabase
        .from("followers_following")
        .select("*", {count: 'exact'})
        .eq("follower_id", user.value.id)

        return count
}

const fetchIsFollowing = async () => {
    // Check that user is logged in and logged in user is not the same user that is being followed. 
    if (loggedInUser.value && loggedInUser.value.id !== user.value.id) {
        const { data } = await supabase
            .from("followers_following")
            .select()
            .eq("follower_id", loggedInUser.value.id)
            .eq("following_id", user.value.id)
            .single();

        if (data) return isFollowing.value = true;

    }

}

watch(loggedInUser, () => {
    fetchIsFollowing()
})

onMounted(() => {
    fetchData()
})

</script>

<template>
    <Container>
        <div class="profile-container" v-if="!loading">
            <UserBar :key="$route.params.username" :user="user" :userInfo="userInfo" :addNewPost="addNewPost" :isFollowing="isFollowing" :updateIsFollowing="updateIsFollowing" />
            <ImageGallery :posts="posts" />
        </div>
        <div class="spinner" v-else>
            <ASpin />
        </div>

    </Container>
</template>

<style scoped>
.profile-container {
    padding: 20px 0px;
    display: flex;
    flex-direction: column;
}

.spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 85vh;
}
</style>