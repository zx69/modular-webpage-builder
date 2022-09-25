/* eslint-disable import/prefer-default-export */
import {
  defineComponent, reactive, computed, ref, toRefs, watch, onMounted, toRef, Ref, ComputedRef, PropType,
} from 'vue';
import {
  MixedPhotoItem,
  PhotoItem,
  removePhotoFromLibray,
} from '@/api/brochure';

export const useContextMenu = (fileListRef: Ref<(MixedPhotoItem & { key: string })[]>, statusRef: Ref<string>, type: 'photo' | 'video') => {
  const _state = reactive({
    currentContextMenuTarget: null as HTMLImageElement | null,
    contextMenuPostion: {
      x: 0,
      y: 0,
    },
  });

  const showContextMenu = (ev: MouseEvent) => {
    if (statusRef.value === 'manage' || !(ev.currentTarget as HTMLElement).dataset.src) {
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
      if (fileItem.status !== 'fail' && fileItem.id) {
        removePhotoFromLibray(fileItem.id);
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

