<template>
  <div
    ref="containerRef"
    class="virtual-list-container"
    :style="{ overflowY: 'auto', height: height + 'px', position: 'relative' }"
    @scroll="onScroll"
  >
    <div
      class="virtual-list-phantom"
      :style="{ height: totalHeight + 'px', position: 'relative' }"
    >
      <div
        v-for="(item, i) in visibleData"
        :key="getItemKey(item, i)"
        class="virtual-list-item"
        :style="getItemStyle(i)"
      >
        <slot :item="item" :index="startIndex + i"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue-demi';

export default defineComponent({
  name: 'VirtualList',
  props: {
    data: { type: Array, required: true },
    itemHeight: { type: Number, required: true }, // 固定高度
    height: { type: Number, default: 300 },
    buffer: { type: Number, default: 5 },
    keyField: { type: String, default: 'id' }
  },
  setup(props) {
     const containerRef = ref<HTMLElement | null>(null);
    const scrollTop = ref(0);
    const startIndex = ref(0);

    // 可视区域可显示的条数
    const visibleCount = computed(() => {
      return Math.ceil(props.height / props.itemHeight);
    });

    // 总高度
    const totalHeight = computed(() => props.data.length * props.itemHeight);

    // 计算 slice 起始位置
    const start = computed(() => Math.max(0, startIndex.value - props.buffer));

    // 可见数据（含 buffer）
    const visibleData = computed(() => {
      const end = Math.min(
        props.data.length,
        startIndex.value + visibleCount.value + props.buffer
      );
      return props.data.slice(start.value, end);
    });

    // 每条 item 样式
    const getItemStyle = (i: number) => {
      const top = (start.value + i) * props.itemHeight;
      return {
        position: 'absolute',
        top: top + 'px',
        height: props.itemHeight + 'px',
        width: '100%'
      };
    };


    const getItemKey = (item: any, i: number) =>
      item?.[props.keyField] ?? i;

    const onScroll = () => {
      if (!containerRef.value) return;
      const scroll = containerRef.value.scrollTop;
      scrollTop.value = scroll;
      startIndex.value = Math.floor(scroll / props.itemHeight);
    };

    onMounted(() => {
      if (containerRef.value) containerRef.value.scrollTop = 0;
    });

    watch(() => props.data, () => {
      startIndex.value = 0;
    });

    return {
      containerRef,
      visibleData,
      getItemStyle,
      onScroll,
      totalHeight,
      startIndex,
      getItemKey
    };
  }
});
</script>

<style scoped>
.virtual-list-container {
  width: 100%;
}
</style>
