<template>
  <div class="mb-3">
    <el-alert :title="$route.meta.name || '欢迎来到滴滴陪朕'" type="info" :description="$route.meta.describe || '随叫随到。保证完成任务'" :closable="false" />
  </div>
</template>

<script setup lang="ts" generic="T"></script>
