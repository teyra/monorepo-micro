<template>
  <div>
    <Teleport to="body">
      <transition name="fade">
        <div class="preview-wrapper" @wheel="handleWheel" v-if="show">
          <div class="mask"></div>
          <div class="content" :style="mediaScaleStyle">
            <div class="preview-media">
              <span
                v-show="loading && mediaType !== MediaType.AUDIO"
                class="loading"
                v-loading="loading"
                element-loading-text="加载中..."
              ></span>
              <video
                :src="mediaUrl"
                controls
                playsinline
                :style="mediaStyle"
                ref="mediaRef"
                @loadedmetadata="onMediaLoad"
                controlslist="nodownload"
                v-if="mediaType === MediaType.VIDEO"
              />
              <img
                loading="lazy"
                alt=""
                ref="mediaRef"
                :style="mediaStyle"
                @load="onMediaLoad"
                v-if="mediaType === MediaType.IMAGE"
                @mousedown="handleMouseDown"
                :src="mediaUrl"
              />
              <audio
                :src="mediaUrl"
                controls
                playsinline
                @loadedmetadata="onMediaLoad"
                controlslist="nodownload"
                v-if="mediaType === MediaType.AUDIO"
              />
            </div>
          </div>
          <Transition name="scale">
            <span v-if="disabled && !loading" class="scale-percentage">
              {{ transform.scale.toFixed(0) }}%
            </span>
          </Transition>
          <span
            class="prev-icon"
            :class="!infinite && currentIndex === 0 ? 'check-disabled' : ''"
            @click="handlePrev"
            v-if="previewSrcList.length > 1"
          >
            <cf-icon
              :size="24"
              icon="ArrowLeft"
              :disabled="!infinite && currentIndex === 0"
            ></cf-icon>
          </span>
          <span
            class="next-icon"
            :class="
              !infinite && currentIndex === previewSrcList.length - 1
                ? 'check-disabled'
                : ''
            "
            @click="handleNext"
            v-if="previewSrcList.length > 1"
          >
            <cf-icon
              :size="24"
              icon="ArrowRight"
              :disabled="
                !infinite && currentIndex === previewSrcList.length - 1
              "
            ></cf-icon>
          </span>
          <span class="close" @click="handleClose">
            <cf-icon :size="24" icon="Close"></cf-icon>
          </span>
          <span class="indicator" v-if="previewSrcList.length > 1">
            {{ currentIndex + 1 }}/{{ previewSrcList.length }}
          </span>
          <div
            class="action-container"
            v-if="mediaType !== MediaType.AUDIO && !loading"
          >
            <el-tooltip
              :content="item.tip"
              placement="bottom"
              effect="light"
              style="z-index: 2030"
              v-for="(item, index) in acitonList"
              :key="index"
            >
              <cf-icon
                :size="24"
                @click="handleAction(item, item.key)"
                color="var(--cf-color-grey-4)"
                :icon="item.icon"
              />
            </el-tooltip>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
import { MediaType } from "@micro/enums/media";
import { getMediaType } from "@micro/utils/media";
import { useEventListener } from "@vueuse/core";
import { throttle } from "lodash-es";
import { computed, ref, watch, type CSSProperties } from "vue";
export interface PreviewProps {
  previewSrcList: any[];
  initialIndex: number;
  infinite?: boolean;
  width?: number;
  height?: number;
  minScale?: number;
  maxScale?: number;
  zoomRate?: number;
  actions?: MediaAction[];
}
interface MediaAction {
  icon: any;
  key: string;
  tip: string;
}

const emit = defineEmits<{
  "action-change": [action: string];
}>();

const props = withDefaults(defineProps<PreviewProps>(), {
  previewSrcList: () => [],
  initialIndex: 0,
  width: 100,
  height: 60,
  minScale: 25,
  maxScale: 500,
  zoomRate: 5,
  infinite: false,
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
const acitonList = computed(() => {
  if (mediaType.value === MediaType.IMAGE) {
    return props.actions;
  }
  if (mediaType.value === MediaType.VIDEO) {
    return props.actions.filter((item) => item.key !== "fullScreen");
  }
  if (mediaType.value === MediaType.AUDIO) {
    return [];
  }
  return [];
});
const loading = ref(true);
const show = defineModel({ default: false, type: Boolean });
const mediaRef = ref<HTMLImageElement | HTMLVideoElement>();
const previewWidth = ref(800);
const previewHeight = ref(500);
const originWidth = ref(0);
const originHeight = ref(0);
const clientWidth = ref(0);
const clientHeight = ref(0);
const defaultScale = ref(100);
const disabled = ref(false);
const currentIndex = ref(props.initialIndex);
const mediaType = ref<MediaType>(MediaType.IMAGE);
const mediaUrl = ref(props.previewSrcList[currentIndex.value]);
const defaultTransform = () => {
  return {
    scale: defaultScale.value,
    deg: 0,
    offsetX: 0,
    offsetY: 0,
    enableTransition: false,
  };
};
const transform = ref({ ...defaultTransform() });
const mediaScaleStyle = computed(() => {
  const { scale, enableTransition } = transform.value;
  const style: CSSProperties = {
    transform: `scale(${scale / 100},${scale / 100})`,
    transition: enableTransition ? "transform .3s" : "",
  };
  return style;
});
const mediaStyle = computed(() => {
  const { deg, offsetX, offsetY, enableTransition } = transform.value;
  let translateX = offsetX;
  let translateY = offsetY;
  switch (deg % 360) {
    case 90:
    case -270:
      [translateX, translateY] = [translateY, -translateX];
      break;
    case 180:
    case -180:
      [translateX, translateY] = [-translateX, -translateY];
      break;
    case 270:
    case -90:
      [translateX, translateY] = [-translateY, translateX];
      break;
  }

  const style: CSSProperties = {
    transform: `rotate(${deg}deg) translate(${translateX}px, ${translateY}px)`,
    transition: enableTransition ? "transform .3s" : "",
    width: `${previewWidth.value}px`,
    height: `${previewHeight.value}px`,
  };
  return style;
});
watch(
  () => currentIndex.value,
  () => {
    handleResetTransform();
    loading.value = true;
    mediaUrl.value = props.previewSrcList[currentIndex.value];
    mediaType.value = getMediaType(mediaUrl.value);
  }
);
watch(
  () => show.value,
  (val) => {
    if (val) {
      currentIndex.value = props.initialIndex;
      loading.value = true;
      mediaUrl.value = props.previewSrcList[currentIndex.value];
      mediaType.value = getMediaType(mediaUrl.value);
    }
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
    const media = mediaRef.value as HTMLVideoElement;
    width = media?.videoWidth || 0;
    height = media?.videoHeight || 0;
  }
  originWidth.value = width;
  originHeight.value = height;
  let originRatio = width / height;
  clientWidth.value = window.innerWidth;
  clientHeight.value = window.innerHeight;
  let clientRatio = clientWidth.value / clientHeight.value;
  if (width < clientWidth.value && height < clientHeight.value) {
    previewWidth.value = width;
    previewHeight.value = height;
  } else if (width < clientWidth.value && height >= clientHeight.value) {
    previewWidth.value = clientHeight.value * originRatio;
    previewHeight.value = clientHeight.value;
  } else if (width >= clientWidth.value && height < clientHeight.value) {
    previewWidth.value = clientWidth.value;
    previewHeight.value = clientWidth.value / originRatio;
  } else if (width > clientWidth.value && height > clientHeight.value) {
    if (originRatio === clientRatio) {
      previewWidth.value = clientWidth.value;
      previewHeight.value = clientHeight.value;
    } else if (originRatio < clientRatio) {
      previewWidth.value = clientHeight.value * originRatio;
      previewHeight.value = clientHeight.value;
    } else if (originRatio > clientRatio) {
      previewWidth.value = clientWidth.value;
      previewHeight.value = clientWidth.value / originRatio;
    }
  }
  loading.value = false;
};

const handlePrev = () => {
  if (currentIndex.value) {
    currentIndex.value -= 1;
  } else {
    if (props.infinite) {
      currentIndex.value = props.previewSrcList.length - 1;
    }
  }
  transform.value.scale = defaultScale.value;
};
const handleNext = () => {
  if (currentIndex.value === props.previewSrcList.length - 1) {
    if (!props.infinite) {
      return;
    }
    currentIndex.value = 0;
  } else {
    currentIndex.value += 1;
  }
  transform.value.scale = defaultScale.value;
};
const handleClose = () => {
  handleResetTransform();
  currentIndex.value = 0;
  show.value = false;
};

const handleAction = (item: any, action: string) => {
  switch (action) {
    case "fullScreen":
      handleFullScreen();
      break;
    case "zoomOut":
      handleZoomOut();
      break;
    case "zoomIn":
      handleZoomIn();
      break;
    case "origin":
      handleOrigin();
      break;
    case "edit":
      handleEdit(item);
      break;
  }
};
const handleResetTransform = () => {
  transform.value = defaultTransform();
};
const handleMouseDown = (e: MouseEvent) => {
  if (e.button !== 0 || loading.value) return;
  transform.value.enableTransition = false;
  const { offsetX, offsetY } = transform.value;
  const startX = e.pageX;
  const startY = e.pageY;
  const dragHandler = throttle((ev: MouseEvent) => {
    transform.value = {
      ...transform.value,
      offsetX: offsetX + ev.pageX - startX,
      offsetY: offsetY + ev.pageY - startY,
    };
  });
  const removeMousemove = useEventListener(document, "mousemove", dragHandler);
  useEventListener(document, "mouseup", () => {
    removeMousemove();
  });
  e.preventDefault();
};
const handleWheel = (event: any) => {
  if (mediaType.value === MediaType.AUDIO || loading.value) {
    return;
  }
  if (event.deltaY > 0) {
    handleZoomOut();
  } else if (event.deltaY < 0) {
    handleZoomIn();
  }
};
const handleZoomOut = () => {
  const { minScale, maxScale, zoomRate } = props;
  if (transform.value.scale > maxScale) {
    transform.value.scale = maxScale;
  } else if (
    transform.value.scale <= maxScale &&
    transform.value.scale % zoomRate !== 0
  ) {
    const scale = Math.round(transform.value.scale / zoomRate) * zoomRate;
    transform.value.scale = scale;
  } else if (transform.value.scale > minScale) {
    transform.value.scale -= zoomRate;
  }
  disabled.value = true;
  setTimeout(() => {
    disabled.value = false;
  }, 2000);
};
const disableVideoZoomIn = () => {
  const width = Number(mediaRef.value?.style.width.split("px")[0]) || 0;
  const height = Number(mediaRef.value?.style.height.split("px")[0]) || 0;
  if (
    mediaType.value === MediaType.VIDEO &&
    width * (transform.value.scale / 100) >= clientWidth.value
  ) {
    return;
  }
  if (
    mediaType.value === MediaType.VIDEO &&
    height * (transform.value.scale / 100) >= clientHeight.value
  ) {
    return;
  }

  return true;
};
const handleZoomIn = () => {
  if (!disableVideoZoomIn()) {
    return;
  }
  const { maxScale, zoomRate } = props;
  if (transform.value.scale < maxScale) {
    transform.value.scale += zoomRate;
  }
  disabled.value = true;
  setTimeout(() => {
    disabled.value = false;
  }, 2000);
};
const handleOrigin = () => {
  handleResetTransform();
};

const handleFullScreen = () => {
  handleResetTransform();
  const { zoomRate } = props;
  const width = mediaRef.value?.width || 0;
  const height = mediaRef.value?.height || 0;
  const newWidthScale = clientWidth.value / (width / defaultScale.value);
  const newHeightScale = clientHeight.value / (height / defaultScale.value);
  const newScale = Math.max(newHeightScale, newWidthScale);
  if (defaultScale.value !== newScale) {
    transform.value.scale = closestMultipleOfFive(newScale, zoomRate);
  }
};
const closestMultipleOfFive = (scaleNum: number, zoomRate: number) => {
  const remainder = scaleNum % zoomRate;
  if (remainder > zoomRate / 2) {
    return scaleNum + (zoomRate - remainder);
  } else {
    return scaleNum + (zoomRate - remainder);
  }
};
const handleEdit = (item: any) => {
  emit("action-change", item.key);
  show.value = false;
};
</script>
<style lang="scss">
.el-popper {
  z-index: 2030 !important;
}
</style>
<style lang="scss" scoped>
:deep(.el-loading-spinner .path) {
  stroke: var(--cf-color-grey-1) !important;
}
:deep(.el-loading-spinner .el-loading-text) {
  color: var(--cf-color-grey-1) !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.preview-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2009;
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
  }
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .preview-media {
      display: inline-block;
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
      cursor: grab;
      user-select: none;
      .loading {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .action-container {
    position: absolute;
    bottom: 40px;
    left: calc(50vw - 100px);
    text-align: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.3);
    padding: var(--cf-padding-small) var(--cf-padding-default);
    border-radius: 24px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    cursor: pointer;
    i {
      padding: var(--cf-padding-default) var(--cf-padding-large);
    }
  }
  .check-disabled {
    cursor: not-allowed !important;
  }
  .prev-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 40px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-size: 24px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--el-text-color-regular);
    border-color: #fff;
    cursor: pointer;
  }
  .next-icon {
    position: absolute;
    top: 50%;
    border-radius: 50%;
    transform: translateY(-50%);
    right: 40px;
    text-indent: 2px;
    width: 44px;
    height: 44px;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #fff;
    background-color: var(--el-text-color-regular);
    border-color: #fff;
  }
  .close {
    position: absolute;
    top: 5%;
    border-radius: 50%;
    transform: translateY(-50%);
    right: 40px;
    width: 44px;
    height: 44px;
    font-size: 24px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--el-text-color-regular);
    border-color: #fff;
  }
  .indicator {
    position: absolute;
    top: 5%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 18px;
    font-size: 13px;
    font-weight: 400;
    color: #e8e8e8;
    padding: var(--cf-padding-small) var(--cf-padding-default);
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.3);
  }
  .scale-percentage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--cf-color-grey-1);
  }
  .scale-enter-active,
  .scale-leave-active {
    transition: opacity 0.5s ease;
  }

  .scale-enter-from,
  .scale-leave-to {
    opacity: 0;
  }
}
</style>
