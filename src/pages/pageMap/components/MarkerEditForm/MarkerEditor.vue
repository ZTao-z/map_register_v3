<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import { cloneDeep } from 'lodash'
import { MarkerEditExtra, MarkerEditImage, MarkerEditSelect, MarkerEditTextarea } from '.'
import { useUserStore } from '@/stores'
import type { ElFormType } from '@/shared'
import { HiddenFlagEnum } from '@/shared'

const props = defineProps<{
  modelValue: API.MarkerVo & API.MarkerPunctuateVo
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', v: API.MarkerVo & API.MarkerPunctuateVo): void
}>()

/** 用户信息 */
const userStore = useUserStore()

/** 表单数据 */
const form = ref<API.MarkerVo & API.MarkerPunctuateVo>({})

const { pause, resume } = pausableWatch(form, () => {
  emits('update:modelValue', form.value)
}, { deep: true })

// 初始化缓存的时候不需要重复向上更新，为了避免无相递归更新，这里要暂停一次 watch
const initFormData = () => {
  pause()
  form.value = cloneDeep(props.modelValue)
  resume()
}
initFormData()

/** 表单校验规则 */
const rules: FormRules = {
  markerTitle: [{
    required: true,
    validator: (_, value = '') => (form.value.markerTitle = value.trim()).length > 0,
    message: '标题不能为空（首尾空白字符会被去除）',
    trigger: 'blur',
  }],
  itemList: [{
    required: true,
    validator: (_, items: API.MarkerItemLinkVo[] = []) => (form.value.itemList ??= items).length > 0,
    message: '至少需要选择一项物品',
    trigger: 'change',
  }, {
    validator: (_, items: API.MarkerItemLinkVo[] = []) => items.every(({ count = 0 }) => count > 0),
    message: '物品数量不能为 0',
    trigger: 'change',
  }],
  videoPath: [{
    validator: (_, value = '') => {
      form.value.videoPath = value.trim()
      return !form.value.videoPath || /^https:\/\/www.bilibili.com\/video\/BV[a-zA-Z0-9]+/.test(form.value.videoPath)
    },
    message: '视频链接不正确(需要B站链接)',
    trigger: 'blur',
  }],
}

/** 右侧额外面板 */
const extraId = ref('')

/** 表单实例 */
const formRef = ref<ElFormType | null>(null)
/** 图片编辑器实例 */
const imageEditorRef = ref<InstanceType<typeof MarkerEditImage> | null>(null)

const extraPanelRef = ref<HTMLElement | null>(null)
provide('extraPanel', extraPanelRef)

defineExpose({
  validate: async () => await formRef.value?.validate().catch(() => false),
  uploadPicture: async () => await imageEditorRef.value?.uploadPicture(),
})
</script>

<template>
  <div class="marker-edit-form grid p-4 h-full">
    <el-form ref="formRef" :rules="rules" :model="form" class="w-96" label-width="80px">
      <el-form-item label="点位名称" prop="markerTitle">
        <el-input v-model="form.markerTitle" />
      </el-form-item>

      <el-form-item label="点位标识" prop="hiddenFlag">
        <el-radio-group v-model="form.hiddenFlag">
          <el-radio-button :label="HiddenFlagEnum.SHOW">
            显示
          </el-radio-button>
          <el-radio-button :label="HiddenFlagEnum.HIDDEN">
            隐藏
          </el-radio-button>
          <el-radio-button v-if="userStore.isAdmin || userStore.isNeigui" :label="HiddenFlagEnum.NEIGUI">
            测试服点位
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="所属物品" prop="itemList">
        <MarkerEditSelect v-model="form.itemList" v-model:extra-id="extraId" />
      </el-form-item>

      <el-form-item label="点位说明" prop="content">
        <MarkerEditTextarea v-model="form.content" v-model:extra-id="extraId" />
      </el-form-item>

      <el-form-item label="点位图像" prop="picture">
        <MarkerEditImage
          ref="imageEditorRef"
          v-model="form.picture"
          v-model:extra-id="extraId"
          v-model:creator-id="form.pictureCreatorId"
        />
      </el-form-item>

      <el-form-item label="附加数据" prop="extra">
        <MarkerEditExtra v-model="form.extra" />
      </el-form-item>

      <el-form-item label="点位视频" prop="videoPath">
        <el-input v-model="form.videoPath" />
      </el-form-item>

      <el-form-item v-if="$slots.footer" label-width="0" style="margin-bottom: 0;">
        <slot name="footer" />
      </el-form-item>
    </el-form>

    <div class="addon-panel" :class="{ visible: extraId }">
      <div ref="extraPanelRef" class="addon-panel-content" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.marker-edit-form {
  grid-template-columns: 1fr auto;
}

.addon-panel {
  width: 0;
  height: 100%;
  padding-left: 0;
  transition: var(--el-transition-all);
  overflow: hidden;
  position: relative;
  .addon-panel-content {
    position: absolute;
    top: 0;
    height: 100%;
    min-width: 384px;
  }
  &.visible {
    width: 400px;
    padding-left: 1rem;
  }
}
</style>
