<template>
  <div
    v-if="mediaType !== MediaType.AUDIO"
    class="media-container"
    :style="{
      'border-radius': radius + 'px',
      'min-width': src ? 0 : width + 'px',
      'min-height': src ? 0 : height + 'px',
    }"
  >
    <div v-if="loading" class="loading">
      <img
        v-if="mediaType === MediaType.IMAGE"
        class="view"
        loading="lazy"
        alt=""
        :src="iconLoad"
        :width="20"
        :height="20"
      />
      <img
        v-if="mediaType === MediaType.VIDEO"
        class="view"
        loading="lazy"
        alt=""
        :src="iconPlay"
        :width="20"
        :height="20"
      />
    </div>
    <video
      v-if="mediaType === MediaType.VIDEO && thumbSrc && !snapshot"
      ref="mediaRef"
      :style="mediaStyle"
      :src="thumbSrc"
      @loadeddata="onMediaLoad"
    />
    <img
      v-if="mediaType === MediaType.VIDEO && thumbSrc && snapshot"
      ref="mediaRef"
      :style="mediaStyle"
      :src="thumbSrc"
      @load="onMediaLoad"
      @error="onMediaEror"
    />

    <img
      v-if="mediaType === MediaType.VIDEO"
      class="view"
      loading="lazy"
      alt=""
      :src="iconPlay"
    />
    <div v-if="!loading" class="overlay" @click="handlePreview">
      <cf-icon
        v-if="mediaType === MediaType.IMAGE"
        class="view"
        color="var(--cf-color-grey-5)"
        icon="View"
        :size="20"
      />
      <img
        v-if="mediaType === MediaType.VIDEO"
        class="view"
        loading="lazy"
        alt=""
        :src="iconPlay"
      />
    </div>
    <img
      v-if="mediaType === MediaType.IMAGE && thumbSrc"
      ref="mediaRef"
      loading="lazy"
      alt=""
      :style="mediaStyle"
      :src="thumbSrc"
      @load="onMediaLoad"
      @error="onMediaEror"
    />
  </div>
  <el-link
    v-if="mediaType === MediaType.AUDIO && title"
    type="primary"
    @click="handlePreview"
  >
    {{ title }}
  </el-link>
  <Preview
    v-model="maskShow"
    :initial-index="initialIndex"
    :preview-src-list="previewSrcList"
    :actions
    @action-change="handleAction"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch, type CSSProperties } from "vue";
import { MediaType } from "@micro/enums/media";
import { getMediaThmub, getMediaType, getVideoThmub } from "@micro/utils/media";
import Preview from "../media-preview/index.vue";

interface MediaAction {
  icon: any;
  key: string;
  tip: string;
}

export interface MediaItemProps {
  src: string | null;
  previewSrcList: any[];
  initialIndex?: number;
  width?: number;
  height?: number;
  actions?: MediaAction[];
  origin?: boolean;
  fit?: any;
  title?: string;
  radius?: number;
  snapshot?: boolean;
  thumbRatio?: number;
}

const iconPlay =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMSAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAuNDEzMSIgY3k9IjEwIiByPSI3IiBmaWxsPSIjMzMzMzMzIiBmaWxsLW9wYWNpdHk9IjAuNiIvPgo8cGF0aCBkPSJNMTMuNDEzMSAxMEw5LjQxMzA5IDEzTDkuNDEzMDkgN0wxMy40MTMxIDEwWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+";

const iconLoad =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkuMzkxNzUgMTAuMThMMTIuNTAwMSA1TDE5LjE2NjcgMTcuNUgxLjY2Njc1TDcuNTAwMDggNi42NjY2N0w5LjM5MTc1IDEwLjE4VjEwLjE4Wk0xMC4zMjUxIDExLjg2NUwxMi40ODkyIDE1LjgzMzNIMTYuMzg5MkwxMi40MTQyIDguMzgxNjdMMTAuMzI1MSAxMS44NjVWMTEuODY1Wk00LjQ1Njc1IDE1LjgzMzNIMTAuNTQzNEw3LjUwMDA4IDEwLjE4MjVMNC40NTY3NSAxNS44MzMzWk00LjU4MzQxIDYuNjY2NjdDNC4wMzA4OCA2LjY2NjY3IDMuNTAwOTggNi40NDcxNyAzLjExMDI4IDYuMDU2NDdDMi43MTk1NyA1LjY2NTc3IDIuNTAwMDggNS4xMzU4NyAyLjUwMDA4IDQuNTgzMzNDMi41MDAwOCA0LjAzMDggMi43MTk1NyAzLjUwMDg5IDMuMTEwMjggMy4xMTAxOUMzLjUwMDk4IDIuNzE5NDkgNC4wMzA4OCAyLjUgNC41ODM0MSAyLjVDNS4xMzU5NSAyLjUgNS42NjU4NSAyLjcxOTQ5IDYuMDU2NTUgMy4xMTAxOUM2LjQ0NzI1IDMuNTAwODkgNi42NjY3NSA0LjAzMDggNi42NjY3NSA0LjU4MzMzQzYuNjY2NzUgNS4xMzU4NyA2LjQ0NzI1IDUuNjY1NzcgNi4wNTY1NSA2LjA1NjQ3QzUuNjY1ODUgNi40NDcxNyA1LjEzNTk1IDYuNjY2NjcgNC41ODM0MSA2LjY2NjY3WiIgZmlsbD0iI0U4RThFOCIvPgo8L3N2Zz4K";

const emit = defineEmits<{
  "action-change": [action: string];
}>();

const props = withDefaults(defineProps<MediaItemProps>(), {
  src: "",
  previewSrcList: () => [],
  initialIndex: 0,
  width: 44,
  height: 44,
  origin: false,
  fit: "cover",
  radius: 0.5,
  snapshot: false,
  thumbRatio: 50,
  actions: () => [
    {
      icon: "icon-xaw_com_noOriginalSize",
      key: "fullScreen",
      tip: "全屏显示",
    },
    {
      icon: "icon-xaw_com_zoomIn",
      key: "zoomIn",
      tip: "放大",
    },
    {
      icon: "icon-xaw_com_zoomOut",
      key: "zoomOut",
      tip: "缩小",
    },
    {
      icon: "icon-xaw_com_originalSize",
      key: "origin",
      tip: "原始尺寸",
    },
  ],
});

const maskShow = ref(false);
const previewWidth = ref(44);
const previewHeight = ref(44);
const thumbSrc = ref("");
const loading = ref(true);
const mediaType = ref<MediaType>(MediaType.IMAGE);
const mediaRef = ref<HTMLImageElement | HTMLVideoElement>();

const mediaStyle = computed(() => {
  const style: CSSProperties = {
    width: `${previewWidth.value}px`,
    height: `${previewHeight.value}px`,
    objectFit: props.fit,
  };
  return style;
});

watch(
  () => props.src,
  (val: string | null) => {
    if (val) {
      mediaType.value = getMediaType(val);
      if (mediaType.value === MediaType.IMAGE) {
        thumbSrc.value = getMediaThmub(val, props.thumbRatio);
      } else if (mediaType.value === MediaType.VIDEO) {
        thumbSrc.value = props.snapshot ? getVideoThmub(val, 78) : val;
      }
    } else {
      thumbSrc.value = "";
    }
  },
  {
    immediate: true,
  }
);

const onMediaLoad = () => {
  let width = 0;
  let height = 0;
  if (mediaType.value === MediaType.IMAGE) {
    const media = mediaRef.value as HTMLImageElement;
    width = media?.naturalWidth || 0;
    height = media?.naturalHeight || 0;
  } else if (mediaType.value === MediaType.VIDEO) {
    if (props.snapshot) {
      const media = mediaRef.value as HTMLImageElement;
      width = media?.naturalWidth || 0;
      height = media?.naturalHeight || 0;
    } else {
      const media = mediaRef.value as HTMLVideoElement;
      width = media?.videoWidth || 0;
      height = media?.videoHeight || 0;
    }
  }
  if (props.origin) {
    previewWidth.value = (width / height) * previewHeight.value;
  } else {
    previewWidth.value = props.width;
    previewHeight.value = props.height;
  }
  loading.value = false;
};

const onMediaEror = () => {
  thumbSrc.value = props.src || "";
  loading.value = true;
};

const handlePreview = () => {
  maskShow.value = true;
};

const handleAction = (key: string) => {
  emit("action-change", key);
};
</script>

<style scoped lang="scss">
.media-container {
  position: relative;
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  border: 0.5px solid rgba(0, 0, 0, 0.15);
  overflow: hidden;
  cursor: pointer;
  .view {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  &:hover .overlay {
    opacity: 1;
  }
}
</style>
