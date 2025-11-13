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
        :ref="(el: any) => setItemRef(el, start + i)"
        class="virtual-list-item"
        :style="getItemStyle(start + i)"
      >
        <slot :item="item" :index="start + i"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, nextTick, watch, onBeforeUnmount } from 'vue-demi';

export default defineComponent({
  name: 'VirtualList',
  props: {
    data: { type: Array, required: true },
    height: { type: Number, default: 300 },
    buffer: { type: Number, default: 5 },
    keyField: { type: String, default: 'id' },
    estimatedItemHeight: { type: Number, default: 50 },
    scrollDebounce: { type: Number, default: 16 } // 滚动防抖时间(ms)
  },
  setup(props) {
    const containerRef = ref<HTMLElement | null>(null);
    const itemHeights = ref<Map<number, number>>(new Map());
    const prefixHeights = ref<number[]>([0]);
    const startIndex = ref(0);
    const scrollTop = ref(0);

    const totalHeight = computed(() => prefixHeights.value[prefixHeights.value.length - 1] || 0);

    const rebuildPrefix = () => {
      const arr: number[] = [0];
      for (let i = 0; i < props.data.length; i++) {
        const h = itemHeights.value.get(i) ?? props.estimatedItemHeight;
        arr.push(arr[i] + h);
      }
      prefixHeights.value = arr;
    };

    watch(() => props.data, rebuildPrefix, { immediate: true });

    // ------------------ 防抖滚动 ------------------
    let scrollTimer: any = null;
    const onScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (!containerRef.value) return;
        scrollTop.value = containerRef.value.scrollTop;
        const idx = binarySearch(prefixHeights.value, scrollTop.value);
        startIndex.value = Math.max(0, idx);
      }, props.scrollDebounce);
    };

    const binarySearch = (arr: number[], value: number) => {
      let low = 0, high = arr.length - 1;
      while (low <= high) {
        const mid = (low + high) >> 1;
        if (arr[mid] === value) return mid;
        if (arr[mid] < value) low = mid + 1;
        else high = mid - 1;
      }
      return Math.max(0, low - 1);
    };

    const visibleData = computed(() => {
      let end = startIndex.value;
      const len = props.data.length;
      const viewportHeight = props.height;
      let total = 0;

      while (end < len && total < viewportHeight) {
        total += itemHeights.value.get(end) ?? props.estimatedItemHeight;
        end++;
      }
      end = Math.min(len, end + props.buffer);
      const start = Math.max(0, startIndex.value - props.buffer);
      return props.data.slice(start, end);
    });

    const start = computed(() => Math.max(0, startIndex.value - props.buffer));

    const getItemStyle = (index: number) => {
      const top = prefixHeights.value[index] ?? 0;
      return {
        position: 'absolute',
        top: top + 'px',
        width: '100%'
      };
    };

    const getItemKey = (item: any, i: number) => item?.[props.keyField] ?? i;

    // ------------------ ResizeObserver ------------------
    const resizeObservers = new Map<number, ResizeObserver>();

    const setItemRef = (el: HTMLElement | null, index: number) => {
      if (!el) return;

      // 先移除旧 observer
      if (resizeObservers.has(index)) {
        resizeObservers.get(index)!.disconnect();
        resizeObservers.delete(index);
      }

      const observer = new ResizeObserver(() => {
        const height = el.offsetHeight;
        if (height && itemHeights.value.get(index) !== height) {
          itemHeights.value.set(index, height);
          rebuildPrefix();
        }
      });
      observer.observe(el);
      resizeObservers.set(index, observer);

      // 初始测量
      nextTick(() => {
        const height = el.offsetHeight;
        if (height && itemHeights.value.get(index) !== height) {
          itemHeights.value.set(index, height);
          rebuildPrefix();
        }
      });
    };

    onBeforeUnmount(() => {
      resizeObservers.forEach(obs => obs.disconnect());
    });

    return {
      containerRef,
      visibleData,
      totalHeight,
      getItemStyle,
      onScroll,
      getItemKey,
      setItemRef,
      start
    };
  }
});
</script>


<style scoped>
.virtual-list-container {
  width: 100%;
}
</style>
