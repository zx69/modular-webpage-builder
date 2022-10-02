<template>
  <div class="material-tile-item-wrapper">
    <div class="material-tile-item" :class="{ disabled }">
      <div class="img-wrap" :style="imgWrapStyle">
        <el-image :src="material.imgUrl"></el-image>
      </div>
      <div v-if="showBottom" class="bottom">
        <div v-if="showTitle" class="title">
          <div class="over-text">
            {{ material.name }}
          </div>
        </div>
        <div v-if="showPrice" class="price">
          {{ material.price }}
        </div>
        <div class="hover-footer">
          <div class="gray-tags">
            <span v-if="material.applicableSeason" class="gray-tag over-text">{{ material.applicableSeason }}</span>
            <span class="gray-tag over-text">{{ material.category }}</span>
          </div>
          <div v-if="showHeader" class="supplier-bar">
            <template v-if="showSupplier">
              <div class="left">
                <span class="logo-wrap">
                  <el-image :src="material.supplierLogo"></el-image>
                </span>
                <span class="supplier-title over-text">
                  {{ material.supplierName }}
                </span>
              </div>
              <div class="right">
                <i class="i-r-you-12"></i>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, PropType, watch,
} from 'vue';
import { getPx } from '@/utils/style';
import { ProductItem } from '../../typings';

export default defineComponent({
  name: 'material-tile-item',
  props: {
    material: {
      type: Object as PropType<ProductItem>,
      required: true,
    },
    showTitle: {
      type: Boolean,
      default: false,
    },
    showPrice: {
      type: Boolean,
      default: false,
    },
    showHeader: {
      // 原本header的商家信息,现在移动到底部了,为了兼容原本的传参,暂时不修改了
      type: Boolean,
      default: false,
    },
    showSupplier: {
      type: Boolean,
      default: true,
    },
    width: {
      type: [Number, String],
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit, slots }) {
    const showBottom = computed(() => props.showTitle || props.showPrice);
    const imgWrapStyle = computed(() => {
      const shareStyle = {
        // 'border-radius': showBottom.value ? '8px 8px 0 0' : '8px',
      };
      if (!props.width) return shareStyle;
      const width = getPx(props.width);
      return {
        width,
        height: width,
        ...shareStyle,
      };
    });

    return {
      showBottom,
      imgWrapStyle,
    };
  },
});
</script>
<style lang="scss" scoped>
.material-tile-item-wrapper {
  position: relative;

  .material-tile-item {
    cursor: pointer;
    border-radius: 8px;
    transition: transform 0.2s;
    // position: relative;

    &.disabled {
      pointer-events: none;
    }
  }

  .img-wrap {
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    padding-top: 100%;
    .el-image {
      transition: transform 0.2s;
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 0;
    }
    .img-bottom {
      position: absolute;
      left: 10px;
      bottom: 10px;

      .tag {
        display: inline-block;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        padding: 4px 6px;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 5px;
        + .tag {
          margin-left: 5px;
        }
      }
    }
  }

  .bottom {
    position: relative;
    padding: 12px 0;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #222222;
      line-height: 22px;
      display: flex;
      align-items: center;
      .env-tag {
        flex-shrink: 0;
        font-size: 12px;
        color: white;
        background: #21bfb8;
        border-radius: 2px;
        line-height: 18px;
        padding: 1px 4px;
        margin-right: 5px;
        font-weight: 400;
      }
    }
    .price {
      color: #666666;
      line-height: 28px;
    }
    .hover-footer {
      display: none;
      position: absolute;
      bottom: 1px; // 隐藏顶部的boxshadow
      left: 0;
      background: white;
      transform: translateY(100%);
      width: 100%;
      border-radius: 0 0 8px 8px;
      .gray-tags {
        padding: 12px;
        padding-top: 0;
        .gray-tag {
          display: none;
          background: rgba(242, 243, 245, 0.9);
          border-radius: 4px;
          color: #666666;
          padding: 6px;
          font-size: 12px;
          margin-top: 6px;
          + .gray-tag {
            margin-left: 6px;
          }
        }
      }

      .supplier-bar {
        display: none;
        height: 52px;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        .left {
          display: flex;
          align-items: center;
          min-width: 0;
          .logo-wrap {
            flex-shrink: 0;
            display: inline-block;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 5px;
            width: 24px;
            height: 24px;
          }
          .supplier-title {
            flex: 1;
            // color: white;
            font-size: 12px;
          }
        }

      }
    }
  }
  &:hover {
    z-index: 999;
    .material-tile-item {
      transform: scale(1.06);
    }

    .img-wrap {
      position: relative;
      z-index: 1;
      border-radius: 8px 8px 0 0;
      .el-image {
        transform: scale(1);
      }
      .img-bottom {
        .tag {
          display: none;
        }
      }
    }

    .bottom {
      padding-top: 12px;
      padding-bottom: 0;
      box-shadow: 0px 2px 10px 0px rgba(200, 201, 208, 0.5), 0px 2px 8px 0px rgba(28, 35, 63, 0.15);
      background: white;
      .title,
      .price {
        padding: 0 12px;
        position: relative;
        z-index: 1;
        background-color: white;
      }

      .hover-footer {
        display: block;
        box-shadow: 0px 2px 10px 0px rgba(200, 201, 208, 0.5), 0px 2px 8px 0px rgba(28, 35, 63, 0.15);
        .gray-tags {
          display: flex;
          .gray-tag {
            display: inline-block;
          }
        }
        .supplier-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #eeeeee;
          .right {
            > i {
              color: #666666;
              font-size: 12px;
              transform: scale(0.7);
              display: inline-block;
            }
          }
        }
      }
    }
  }
}

</style>
