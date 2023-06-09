<script setup>
    import { defineProps } from 'vue';

    const props = defineProps(['post'])
    const {VITE_SUPABASE_PHOTO_URL} = import.meta.env;

</script>

<template>
    <ACard hoverable style="width: 240px" class="card">
        <template #cover>
            <img :src="`${VITE_SUPABASE_PHOTO_URL}${post.url}`" />
        </template>
        <ACardMeta :title="post.username">
            <template #description>{{ post.caption }}</template>
        </ACardMeta>
    </ACard>

</template>

<style scoped>
    .card {
        margin-bottom: 20px;
    }
</style>