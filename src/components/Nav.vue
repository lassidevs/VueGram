<script setup>
import { RouterLink, useRouter } from "vue-router"
import { ref } from "vue"
import Container from "./Container.vue"
import AuthModal from "./AuthModal.vue"
import { useUserStore } from "../stores/users"
import { storeToRefs } from "pinia"

const userStore = useUserStore()

const { user, loadingUser } = storeToRefs(userStore)

const router = useRouter()

const searchUsername = ref("");
const isAuthenticated = ref(false)


const onSearch = () => {
    if (searchUsername.value) {
        router.push(`/profile/${searchUsername.value}`)
        searchUsername.value = ""
    }
}

const goToUsersProfile = () => {
    router.push(`/profile/${user.value.username}`)
}

const handleLogout = async () => {
    await userStore.handleLogout()
}

</script>

<template>
    <ALayoutHeader class="header">
        <Container>
            <div class="nav-container">
                <div class="left-content">
                    <RouterLink to="/">VUEGRAM</RouterLink>
                    <AInputSearch v-model:value="searchUsername" placeholder="username..." @search="onSearch" />
                </div>
                <div class="content" v-if="!loadingUser">
                    <div class="right-content" v-if="!user">
                        <AuthModal :isLogin="false" />
                        <AuthModal :isLogin="true" />
                    </div>
                    <div class="right-content" v-else>
                        <AButton type="primary" @click="goToUsersProfile">Profile</AButton>
                        <AButton type="primary" @click="handleLogout">Log out</AButton>
                    </div>
                </div>


            </div>
        </Container>
    </ALayoutHeader>
</template>

<style scoped>
.nav-container {
    display: flex;
    justify-content: space-between;
}

.right-content,
.left-content,
.content {
    display: flex;
    align-items: center;
}

.left-content a {
    margin-right: 15px;
}

.right-content button {
    margin-left: 10px;
}

</style>