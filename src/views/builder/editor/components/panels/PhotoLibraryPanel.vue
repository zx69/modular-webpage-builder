<template>
  <div class="material-brochure_photo-library-panel control-panel">
    <div class="sidebar-title" v-if="panelType === 'photo'">
      <el-tabs v-model="currentTab" class="header-tabs">
        <el-tab-pane label="素材库" name="common"></el-tab-pane>
        <el-tab-pane label="我上传的" name="mine"></el-tab-pane>
      </el-tabs>
    </div>
    <h3 class="sidebar-title" v-else>
      <div class="flex-space-between">
        <span
          >视频
          <i
            :class="[
              'icon',
              `i-${isNoticeChecked ? 'r-bangzhuzhongxin-16' : 's-bangzhuzhongxin-16'}`,
              !isNoticeChecked ? 'active' : ''
            ]"
            @click="setStoredFlag()"
          ></i>
        </span>
        <PhotoHandleBtns
          v-model:status="status"
          :isConentEmpty="isConentEmpty"
          :panelType="panelType"
          @saveUploadingFile="saveUploadingFile"
        ></PhotoHandleBtns>
      </div>
    </h3>
    <main class="main-content">
      <div class="video-notice-box" v-if="panelType === 'video' && !isNoticeChecked">
        <p v-for="(notice, i) in noticeConfig" :key="i">{{ notice }}</p>
        <footer>
          <el-button type="primary" size="mini" @click="setStoredFlag(true)">知道了</el-button>
        </footer>
      </div>
      <div class="handler-bar flex-space-between" v-show="currentTab === 'mine'">
        <span></span>
        <PhotoHandleBtns
          v-model:status="status"
          :isConentEmpty="isConentEmpty"
          :panelType="panelType"
          @saveUploadingFile="saveUploadingFile"
        ></PhotoHandleBtns>
      </div>
      <transition-group tag="div" name="photo-list" :key="currentTab">
        <template v-if="panelType === 'photo'">
          <div
            class="photo-layout-box"
            v-for="(box, i) in currentTab === 'mine' ? layoutedPhotoList : layoutedCommonPhotoList"
            :key="box.key"
            :style="{
              width: getPx(box.width),
              height: getPx(box.height),
              transform: `translate(${getPx(box.left)}, ${getPx(box.top)})`
            }"
            :data-src="box.url"
            @contextmenu.prevent="showContextMenu"
          >
            <base-image
              :src="box.fullUrl"
              :draggable="true"
              @dragstart="ev => handleDragStart(ev, photoList[i])"
            ></base-image>
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
              <p v-if="box.status === 'fail'" class="error-notice">{{ $t("material-manage.upload.upload_error") }}</p>
            </div>
            <i
              v-if="status === 'manage'"
              @click.stop="removeFile(box.url)"
              class="icon remove-icon flex-center i-r-guanbi-16"
            ></i>
          </div>
        </template>
        <template v-if="panelType === 'video'">
          <div
            class="video-layout-box"
            v-for="video in computedVideoList"
            :key="video.key"
            :data-src="video.url"
            @contextmenu.prevent="showContextMenu"
          >
            <base-video
              :src="video?.fullUrl"
              :draggable="true"
              @getVideoSize="sizeObj => saveVideoSize(video, sizeObj)"
              @dragstart="ev => handleDragStart(ev, video)"
            />
            <div class="image-veil" v-if="video.status && ['uploading', 'fail'].includes(video.status)">
              <el-progress
                v-if="video.status === 'uploading'"
                type="circle"
                color="#fff"
                :percentage="(video.uploadedSize / video.file.size) * 100"
                :width="84 * 0.6"
                :stroke-width="4"
                :show-text="false"
              />
              <p v-if="video.status === 'fail'" class="error-notice">{{ $t("material-manage.upload.upload_error") }}</p>
            </div>
            <i
              v-if="status === 'manage'"
              @click.stop="removeFile(video.url)"
              class="icon remove-icon flex-center i-r-guanbi-16"
            ></i>
          </div>
        </template>
      </transition-group>
      <BlockError
        v-if="isConentEmpty"
        class="no-photo-error"
        size="small"
        :error="{ message: $t('public.table.empty'), code: '404' }"
      >
      </BlockError>
    </main>
    <div
      class="photo-context-menu"
      v-show="currentContextMenuTarget"
      :style="{
        left: getPx(contextMenuPostion.x),
        top: getPx(contextMenuPostion.y)
      }"
    >
      <div class="menu-item" @click.stop="removeFile()">{{ $t("public.table.delete") }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, watch, onMounted, toRef, Ref, ComputedRef, PropType,
} from 'vue';
import justifiedLayout from 'justified-layout';
import { BlockError, BaseVideo } from '../../bridge/components';
import {
  fetchPhotoLibraryList,
  fetchVideoLibraryList,
  LayoutedPhotoItem,
  MixedPhotoItem,
  MixedVideoItem,
  PhotoItem,
  removePhotoFromLibray,
  removeVideoFromLibray,
} from '../../bridge/api';
import { getPx } from '../../bridge/utils';
// import mock from '../../mock';
import { prepandOssDomain } from '../../utils';
import PhotoHandleBtns from './PhotoHandleBtns.vue';
import useShowOneNotice from '$cm/pages/material-brochure/generator/uses/useShowOneNotice.ts';


const useContextMenu = (fileListRef: Ref<PhotoItem[]>, statusRef: Ref<string>, type: 'photo' | 'video') => {
  const _state = reactive({
    currentContextMenuTarget: null as HTMLImageElement | null,
    contextMenuPostion: {
      x: 0,
      y: 0,
    },
  });

  const showContextMenu = (ev: MouseEvent) => {
    if (statusRef.value === 'manage' || !ev.currentTarget?.dataset?.src) {
      return;
    }
    _state.contextMenuPostion.x = ev.clientX;
    _state.contextMenuPostion.y = ev.clientY;
    _state.currentContextMenuTarget = ev.currentTarget as HTMLImageElement;
  };

  const removeFile = (imgUrl?: string) => {
    // 图片的src后面附加了oss参数, 所以要取dataset.src. 视频则不需要
    const _targetUrl = imgUrl || _state.currentContextMenuTarget?.dataset?.src;
    if (!_targetUrl) {
      return;
    }
    const index = fileListRef.value.findIndex(p => p.url === _targetUrl);
    if (index !== -1) {
      const [fileItem] = fileListRef.value.splice(index, 1);
      // 如果是上传失败的文件, 没有记录到数据库,所以不需要调用接口删除
      if (fileItem.status !== 'fail') {
        type === 'photo' ? removePhotoFromLibray(fileItem.id) : removeVideoFromLibray(fileItem.id);
      }
    }
    _state.currentContextMenuTarget = null;
  };

  onMounted(() => {
    document.addEventListener('click', () => {
      _state.currentContextMenuTarget = null;
    });
  });

  return {
    ...toRefs(_state),
    showContextMenu,
    removeFile,
  };
};


export default defineComponent({
  name: 'material-brochure_photo-library-panel',
  components: {
    BlockError,
    BaseVideo,
    PhotoHandleBtns,
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
      currentTab: 'common' as 'common' | 'mine',
      status: 'normal',
      currentLayoutHeight: 0,
      photoList: [] as (MixedPhotoItem & { key: string })[],
      commonPhotoList: [] as (MixedPhotoItem & { key: string })[],
      videoList: [] as (MixedVideoItem & { key: string })[],
    });

    const {
      isNoticeChecked,
      setStoredFlag,
    } = useShowOneNotice('brochureVideoSizeNotice');

    const getPhotoLibraryList = async () => {
      // 图片/视频列表需要一个唯一不变值作为key, 但又不能用url或id(因为后面上传的项目没有id,而且id和url上传后又会变).
      // 所以这里统一生成一个key给列表使用.
      if (props.panelType === 'video') {
        const _res = await fetchVideoLibraryList();
        state.videoList = _res.map(item => ({ ...item, key: item.id }));
      } else {
        const _res = await fetchPhotoLibraryList();
        state.photoList = _res.map(item => ({ ...item, key: item.id }));
        const _res2 = await fetchPhotoLibraryList(1);
        state.commonPhotoList = _res2.map(item => ({ ...item, key: item.id }));
      }
      // state.photoList = mock.pictureList;
    };

    onMounted(async () => {
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
        fullUrl: prepandOssDomain(`${state.photoList[i].url}`),
        file: state.photoList[i].file,
        uploadedSize: state.photoList[i].uploadedSize ?? 0,
        status: state.photoList[i].status,
        name: state.photoList[i].name,
        key: state.photoList[i].key,
      }));
    });

    // 生成justified-layout布局
    const layoutedCommonPhotoList = computed<LayoutedPhotoItem[]>(() => {
      const photoSizeList = state.commonPhotoList.map(photo => ({ width: photo.width || 100, height: photo.length || 64 }));
      const layoutGeometry = justifiedLayout(photoSizeList, {
        containerWidth: 200,
        containerPadding: 0,
        targetRowHeight: 64,
      });
      return layoutGeometry.boxes.map((box, i) => ({
        ...box,
        url: state.photoList[i].url,
        fullUrl: prepandOssDomain(`${state.photoList[i].url}`),
        file: state.photoList[i].file,
        uploadedSize: state.photoList[i].uploadedSize ?? 0,
        status: state.photoList[i].status,
        name: state.photoList[i].name,
        key: state.photoList[i].key,
      }));
    });

    const computedVideoList = computed(() => {
      return state.videoList.map(video => ({
        ...video,
        url: video.url,
        fullUrl: prepandOssDomain(video.url),
      }));
    });

    const isConentEmpty = computed(() => {
      if (props.panelType === 'photo') {
        return (state.currentTab === 'mine' ? layoutedPhotoList.value : layoutedCommonPhotoList.value).length === 0;
      }
      return (props.panelType === 'video' && state.videoList.length === 0);
    });

    // 右键菜单操作
    const {
      showContextMenu,
      removeFile,
      currentContextMenuTarget,
      contextMenuPostion,
    } = useContextMenu(
      toRef(state, props.panelType === 'photo' ? 'photoList' : 'videoList'),
      toRef(state, 'status'),
      props.panelType,
    );

    // [管理]图片库
    const managePhoto = () => {
      state.status = state.status === 'normal' ? 'manage' : 'normal';
    };

    // 接受合并已上传图片和本地图片
    const saveUploadingFile = (uploadingFile: MixedPhotoItem[]) => {
      if (props.panelType === 'photo') {
        state.photoList = [...uploadingFile, ...state.photoList];
      } else {
        state.videoList = [...uploadingFile, ...state.videoList];
      }
    };

    const handleDragStart = (ev: DragEvent, photo: Obj) => {
      const _dataType = props.panelType === 'photo' ? 'image-path' : 'video-path';
      let _transferData: { url: string, width: number, height: number } = { url: photo.url };
      if (props.panelType === 'photo') {
        // const _imgRect = (ev.target as HTMLElement)?.getBoundingClientRect();
        _transferData = {
          url: photo.url,
          width: photo.width,
          height: photo.length,
        };
      } else {
        _transferData = {
          url: photo.url,
          width: photo.width,
          height: photo.height,
        };
      }
      ev.dataTransfer?.setData(_dataType, JSON.stringify(_transferData));
    };

    // 设置视频尺寸
    const saveVideoSize = (videoData: MixedVideoItem, sizeObj: { width: number, height: number }) => {
      videoData.width = sizeObj.width;
      videoData.height = sizeObj.height;
    };

    return {
      ...toRefs(state),
      layoutedPhotoList,
      layoutedCommonPhotoList,
      getPx,
      // handleClick,
      managePhoto,
      currentContextMenuTarget,
      contextMenuPostion,
      showContextMenu,
      removeFile,
      saveUploadingFile,
      handleDragStart,
      isConentEmpty,
      computedVideoList,
      saveVideoSize,
      isNoticeChecked,
      setStoredFlag,
      noticeConfig: [
        '格式: mp4',
        '时长: 10秒-5分钟',
        '大小: 支持50m以内的视频上传',
      ],
    };
  },
});
</script>
<style lang="scss">
// @import 'url'
.material-brochure_photo-library-panel {
  .header-tabs {
    .el-tabs__nav-scroll {
      display: flex;
      justify-content: center;
    }
    .el-tabs__item {
      width: 80px;
      text-align: center;
      padding: 0 !important;
    }
    .el-tabs__active-bar {
      width: 32px !important;
      margin-left: 24px;
    }
  }
  .handler-bar {
    margin-bottom: 12px;
  }
  .main-content {
    padding-top: 12px;
    position: relative;
  }

  .handle-btn--text {
    padding: 0;
    min-height: unset !important;
    margin-left: 16px;
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
    // &:hover {
    //   border: 1px solid $color-primary;
    // }
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
    margin-top: 60px !important;
  }

  .video-notice-box {
    background-color: #fff6e7;
    padding: 12px 12px 20px;
    border-radius: 4px;
    margin-bottom: 12px;
    p {
      color: #ff7c09;
      line-height: 20px;
    }
    footer {
      text-align: center;
      margin-top: 10px;
    }
    .el-button.el-button--mini {
      min-height: unset !important;
    }
  }

  .sidebar-title {
    .icon {
      font-size: 14px;
      &.active {
        color: $color-primary;
      }
    }
  }
}
</style>
