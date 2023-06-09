<script setup>
    import { onMounted } from "vue";
    import Nav from "./components/Nav.vue"
    import { RouterView } from "vue-router"
    import { useUserStore } from "./stores/users"

    const userStore = useUserStore();

    onMounted(() => {
        userStore.getUser();
    })

</script>

<!-- Inside App.vue, render only components that are always present, such as Nav. Avoid logical/dynamic rendering here-->
<template>
    <nav>

    </nav>
    <main>
        <Nav />
        <RouterView />
    </main>
</template>

<style scoped>


</style>
