<template>
  <div style="padding:20px;border: 1px solid #000;">
    <VirtualList :data="list" :itemHeight="40" :height="400">
      <template #default="{ item }">
        <div
          style="box-sizing:border-box;border-bottom:1px solid #eee;display:flex;align-items:center;height:100%;padding-left:8px;"
        >
          {{ item.text }}
        </div>
      </template>
    </VirtualList>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import VirtualList from '../src';

export default defineComponent({
  name: 'App',
  components: { VirtualList },
  setup() {
    const list = ref(Array.from({ length: 1000 }, (_, i) => ({ id: i, text: `Item ${i}` })));
    return { list };
  }
});
</script>
