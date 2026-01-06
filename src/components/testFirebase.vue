<template>
    <div>
        <div v-for="blog in blogs" :key="blog.id">
            <h2>{{ blog.title }}</h2>
            <img :src="blog.authorImage" alt="Author" class="author-image" />
            <p>{{ blog.authorName }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCollection } from '../composables/useFirestore';

const blogs = ref([]);

const loadData = async () => {
    blogs.value = await getCollection();
};

onMounted(() => {
    loadData();
});
</script>