当然可以，这里是整理好的 `README.md` 内容，可以直接保存为 `README.md` 文件：

````markdown
# leoon-vue-virtual-list

一个 Vue 虚拟列表组件，支持 Vue 2 & 3，功能包括：

- **动态高度**（不固定 item 高度）
- **buffer 渲染**
- **滚动防抖**（可配置）
- **ResizeObserver** 自动更新高度
- **支持 slot 渲染任意内容**

---

## 安装

```bash
npm install leoon-vue-virtual-list
# 或者
yarn add leoon-vue-virtual-list
````

---

## 使用示例

### Vue 3

```vue
<template>
  <VirtualList :data="list" :height="400" :estimatedItemHeight="60">
    <template #default="{ item, index }">
      <div style="padding:8px; border:1px solid #ddd; margin:4px 0;">
        {{ index }} - {{ item.text }}
      </div>
    </template>
  </VirtualList>
</template>

<script setup lang="ts">
import VirtualList from 'leoon-vue-virtual-list';

const list = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  text: `Item ${i}`
}));
</script>
```

### Vue 2

```ts
import Vue from 'vue';
import VirtualList from 'leoon-vue-virtual-list';

new Vue({
  el: '#app',
  components: { VirtualList },
  data() {
    return {
      list: Array.from({ length: 1000 }, (_, i) => ({ id: i, text: `Item ${i}` }))
    }
  }
});
```

---

## Props

| 参数                  | 类型       | 默认     | 描述                   |
| ------------------- | -------- | ------ | -------------------- |
| data                | `Array`  | `[]`   | 列表数据                 |
| height              | `Number` | 300    | 容器高度（px）             |
| buffer              | `Number` | 5      | 上下 buffer 条数         |
| keyField            | `String` | `'id'` | item 的唯一 key 字段      |
| estimatedItemHeight | `Number` | 50     | 初始估算 item 高度（用于动态高度） |
| scrollDebounce      | `Number` | 16     | 滚动事件防抖时间 (ms)        |

---

## Slot

* **default**

  * `item`: 当前 item 数据
  * `index`: 当前 item 索引

```vue
<template #default="{ item, index }">
  <div>{{ index }} - {{ item.text }}</div>
</template>
```

---
