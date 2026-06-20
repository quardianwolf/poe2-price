<template>
  <button @click="updateInput" :class="$style['checkbox']" class="group">
    <span class="ee-check" :class="{ 'ee-check--on': modelValue === values[0] }" />
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UiCheckbox",
  emits: ["update:modelValue"],
  props: {
    modelValue: {},
    values: {
      type: Array,
      default: [true, false],
    },
  },
  setup(props, ctx) {
    return {
      updateInput() {
        const [on, off] = props.values;
        ctx.emit("update:modelValue", props.modelValue === on ? off : on);
      },
    };
  },
});
</script>

<style lang="postcss" module>
.checkbox {
  display: flex;
  @apply gap-x-1.5;
  align-items: center;
  text-align: left;
}
</style>
