<template>
  <div class="webpage-builder_photo-library-panel">
    <h3 class="sidebar-title" v-if="title">
      <div class="flex-space-between">
        {{ title }}
        <aside class="handle-btns flex">
          <el-button
            class="handle-btn--text"
            type="text"
            :disabled="status === 'normal' && isConentEmpty"
            @click="managePhoto"
            :class="{ active: status === 'manage' }"
          >
            <i class="iconfont" :class="status === 'normal' ? 'i-yingyongguanli' : 'i-wancheng'"></i>
            {{ status === "normal" ? "管理" : "完成" }}
          </el-button>
          <component
            :is="panelType === 'photo' ? 'PhotoUploader' : 'PhotoUploader'"
            @getFilesWithSize="saveUploadingFile"
          />
        </aside>
      </div>
    </h3>
    <main class="main-content">
      <transition-group name="photo-list">
        <template v-if="panelType === 'photo'">
          <div
            class="photo-layout-box"
            v-for="box in layoutedPhotoList"
            :key="box.key"
            :style="{
              width: getPx(box.width),
              height: getPx(box.height),
              transform: `translate(${getPx(box.left)}, ${getPx(box.top)})`,
            }"
            :data-src="box.url"
            @contextmenu.prevent="showContextMenu"
          >
            <el-image :src="box.url" :draggable="true" @dragstart="(ev) => handleDragStart(ev, box.url)"></el-image>
            <div class="image-veil" v-if="box.status && ['uploading', 'fail'].includes(box.status)">
              <el-progress
                v-if="box.status === 'uploading'"
                type="circle"
                color="#fff"
                :percentage="(box.uploadedSize / box.file.size) * 100"
                :width="box.height * 0.6"
                :stroke-width="4"
                :show-text="false"
              />
              <p v-if="box.status === 'fail'" class="error-notice">上传失败</p>
            </div>
            <i
              v-if="status === 'manage'"
              @click.stop="removeFile(box.url)"
              class="iconfont i-close remove-icon flex-center"
            ></i>
          </div>
        </template>
      </transition-group>
      <div v-if="isConentEmpty" class="no-photo-error">暂无数据</div>
    </main>
    <div
      class="photo-context-menu"
      v-show="currentContextMenuTarget"
      :style="{
        left: getPx(contextMenuPostion.x),
        top: getPx(contextMenuPostion.y),
      }"
    >
      <div class="menu-item" @click.stop="removeFile()">删除</div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, watch, onMounted, toRef, Ref, ComputedRef, PropType,
} from 'vue';
import justifiedLayout from 'justified-layout';
import {
  fetchPhotoLibraryList,
  LayoutedPhotoItem,
  MixedPhotoItem,
} from '@/api/builder';
import { getPx } from '@/utils/style';
import PhotoUploader from './PhotoUploader.vue';
import { useContextMenu } from './useContextMenu';

export default defineComponent({
  name: 'webpage-builder_photo-library-panel',
  components: {
    PhotoUploader,
  },
  props: {
    title: {
      type: String,
    },
    panelType: {
      type: String as PropType<'photo' | 'video'>,
      default: 'photo',
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      status: 'normal',
      currentLayoutHeight: 0,
      photoList: [] as (MixedPhotoItem & { key: string })[],
    });

    const getPhotoLibraryList = async () => {
      // 图片/视频列表需要一个唯一不变值作为key, 但又不能用url或id(因为后面上传的项目没有id,而且id和url上传后又会变).
      // 所以这里统一生成一个key给列表使用.
      const _res = await fetchPhotoLibraryList();
      state.photoList = _res.map(item => ({ ...item, key: item.id! }));
    };

    onMounted(() => {
      getPhotoLibraryList();
    });

    // 生成justified-layout布局
    const layoutedPhotoList = computed<LayoutedPhotoItem[]>(() => {
      const photoSizeList = state.photoList.map(photo => ({ width: photo.width || 100, height: photo.length || 64 }));
      const layoutGeometry = justifiedLayout(photoSizeList, {
        containerWidth: 200,
        containerPadding: 0,
        targetRowHeight: 64,
      });
      return layoutGeometry.boxes.map((box, i) => ({
        ...box,
        url: state.photoList[i].url,
        file: state.photoList[i].file,
        uploadedSize: state.photoList[i].uploadedSize ?? 0,
        status: state.photoList[i].status,
        name: state.photoList[i].name,
        key: state.photoList[i].key,
      }));
    });

    const isConentEmpty = computed(() => {
      return (props.panelType === 'photo' && layoutedPhotoList.value.length === 0);
    });


    // 右键菜单操作
    const {
      showContextMenu,
      removeFile,
      currentContextMenuTarget,
      contextMenuPostion,
    } = useContextMenu(
      toRef(state, 'photoList'),
      toRef(state, 'status'),
      props.panelType,
    );

    // [管理]图片库
    const managePhoto = () => {
      state.status = state.status === 'normal' ? 'manage' : 'normal';
    };

    // 接受合并已上传图片和本地图片
    const saveUploadingFile = (uploadingFile: MixedPhotoItem[]) => {
      state.photoList = [...uploadingFile, ...state.photoList];
    };

    const handleDragStart = (ev: DragEvent, imagePath: string) => {
      const _dataType = 'image-path';
      ev.dataTransfer?.setData(_dataType, imagePath);
    };

    return {
      ...toRefs(state),
      layoutedPhotoList,
      getPx,
      managePhoto,
      currentContextMenuTarget,
      contextMenuPostion,
      showContextMenu,
      removeFile,
      saveUploadingFile,
      handleDragStart,
      isConentEmpty,
    };
  },
});
</script>
<style lang="scss">
.webpage-builder_photo-library-panel {
  .main-content {
    position: relative;
  }
  .handle-btn--text {
    margin-left: 16px;
    color: #333333;
  }
  .photo-layout-box {
    position: absolute;
    transition: transform 0.5s ease;
    .el-image {
      border-radius: 0;
    }
  }
  .video-layout-box {
    height: 84px;
    margin-bottom: 12px;
    position: relative;
  }
  .photo-layout-box,
  .video-layout-box {
    cursor: pointer;
    .image-veil {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(#999, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .el-progress {
      .el-progress-circle__track {
        stroke: rgba(#fff, 0.3);
      }
    }
    .error-notice {
      color: #fff;
      font-size: 12px;
      text-align: center;
    }
    .remove-icon {
      position: absolute;
      right: 5px;
      top: 5px;
      color: #fff;
      background-color: #000;
      opacity: 0.3;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 12px;
      cursor: pointer;
      &:hover {
        opacity: 0.6;
      }
    }
  }
  .photo-context-menu {
    position: fixed;
    color: #333;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    .menu-item {
      padding: 6px 16px;
      white-space: nowrap;
      cursor: pointer;
      &:hover {
        color: #21bfb8;
        background-color: #e9f9f8;
      }
    }
  }

  .photo-list-enter-active,
  .photo-list-leave-active {
    transition: all 0.5s ease;
  }
  .photo-list-enter-from,
  .photo-list-leave-to {
    opacity: 0;
  }
  .no-photo-error {
    text-align:center;
    color: #dddddd;
    margin-top: 60px !important;
  }

  .sidebar-title{
    margin-bottom: 16px;
  }
}
</style>
