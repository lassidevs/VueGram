<script setup>
import Container from "./Container.vue"
import Cards from "../components/Cards.vue"
import LogInMessage from "../components/LogInMessage.vue"
import { useUserStore } from "../stores/users.js"
import { storeToRefs } from "pinia";

const userStore = useUserStore();

const { user, loadingUser } = storeToRefs(userStore)


</script>

<template>
    <Container>
        <div v-if="!loadingUser">
            <Cards v-if="user"/>
            <LogInMessage v-else/>
        </div>
        <div v-else>
            <div class="timeline-spinner">
                <ASpin />
            </div>
        </div>
    </Container>
</template>

<style> /* Not scoped styling as these apply on multiple components*/

.timeline-container {
    padding: 20px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.timeline-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 85vh;
}
</style>