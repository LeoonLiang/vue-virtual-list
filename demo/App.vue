<template>
  <VirtualList :data="list" :height="400" :estimatedItemHeight="60">
    <template #default="{ item }">
      <div
        :style="{
          background: '#f9f9f9',
          margin: '4px 0',
          border: '1px solid #ddd',
          padding: '8px'
        }"
      >
        <strong>{{ item.title }}</strong>
        <p>{{ item.content }}</p>
      </div>
    </template>
  </VirtualList>
</template>

<script setup lang="ts">
import VirtualList from '../src';
const list = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  title: `Title ${i}`,
  content: '这是一个随机高度的内容 '.repeat(Math.floor(Math.random() * 20 + 1))
}));
</script>
