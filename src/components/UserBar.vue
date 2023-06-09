<script setup>
import { defineProps } from "vue"
import UploadPhotoModal from "./UploadPhotoModal.vue"
import { useRoute } from "vue-router"
import { useUserStore } from "../stores/users"
import { storeToRefs } from "pinia";


const route = useRoute();
const userStore = useUserStore();
import { supabase } from "../../config/supabase";

const { user } = storeToRefs(userStore)
const { username: profileUsername } = route.params


const props = defineProps(['user', 'userInfo', 'addNewPost', 'isFollowing', 'updateIsFollowing'])

const followUser = async () => { 
  try {
    props.updateIsFollowing(true)
    await supabase.from("followers_following").insert({
      follower_id: user.value.id,
      following_id: props.user.id
    })
  } catch (error) {
    console.error(error);
  }
};
const UnfollowUser = async () => { 
  try {
    props.updateIsFollowing(true)
    await supabase.from("followers_following")
    .delete()
    .eq("follower_id", user.value.id)
    .eq("following_id", props.user.id)
  } catch (error) {
    console.error(error);
  }
};

</script>

<template>
    <div class="userbar-container" v-if="props.user">
        <div class="top-content">
            <ATypographyTitle :level="2">{{ props.user.username }}</ATypographyTitle>
            <div v-if="user">
                <UploadPhotoModal v-if="profileUsername === user.username" :addNewPost="addNewPost" />
                <div v-else>
                    <AButton v-if="!isFollowing" @click="followUser">Follow</AButton>
                    <AButton v-else @click="UnfollowUser">Following</AButton>
                </div>
            </div>
        </div>
        <div class="bottom-content">
            <ATypographyTitle :level="5">{{ props.userInfo.posts }} posts</ATypographyTitle>
            <ATypographyTitle :level="5">{{ props.userInfo.followers }} followers</ATypographyTitle>
            <ATypographyTitle :level="5">{{ props.userInfo.following }} following</ATypographyTitle>
        </div>
    </div>
    <div v-else class="userbar-container">
        <div class="top-content">
            <ATypographyTitle :level="2">User not found</ATypographyTitle>

        </div>
    </div>
</template>

<style scoped>
.userbar-container {
    padding-bottom: 75px;
}

.bottom-content {
    display: flex;
    align-items: center;
}

.bottom-content h5 {
    padding: 0;
    margin: 0px 30px 0px 0px !important;
}

.top-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>