<script setup>
import Card from "../components/Card.vue"
import Observer from "../components/Observer.vue"
import { supabase } from "../../config/supabase"
import { useUserStore } from "../stores/users"
import { storeToRefs } from "pinia"
import { onMounted, ref } from "vue"

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const posts = ref([]);
const lastCardIndex = ref(2);
const ownerIds = ref([]);
const reachEnd = ref(false);

const fetchData = async () => {
        const { data: followings } = await supabase // get accounts that user is following
            .from("followers_following")
            .select("following_id")
            .eq("follower_id", user.value.id)
        ownerIds.value = followings.map(f => f.following_id) // map each accounts id on "owner_id" variable

        const { data } = await supabase
            .from("posts")
            .select()
            .in("owner_id", ownerIds.value) // select all posts user is following
            .range(0, lastCardIndex.value)
            .order("created_at", { ascending: false })

        posts.value = data;

}

const fetchNextSet = async () => {
if(!reachEnd.value) {
    const { data } = await supabase
        .from("posts")
        .select()
        .in("owner_id", ownerIds.value)
        .range(lastCardIndex.value + 1, lastCardIndex.value + 3)
        .order("created_at", { ascending: false })
    
    posts.value = [
        ...posts.value,
        ...data
    ]
    lastCardIndex.value = lastCardIndex.value + 3;
    
    if (!data.length) {
        reachEnd.value = true;
    }
} 

}

onMounted(() => {
    fetchData()
})


</script>

<template>
    <div class="timeline-container">
        <Card v-for="post in posts" :key="post.id" :post="post" />
    </div>
    <Observer v-if="posts.length" @intersect="fetchNextSet" />
</template>
