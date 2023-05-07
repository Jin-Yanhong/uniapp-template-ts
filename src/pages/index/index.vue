<template>
	<view class="pages index"> </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import apiUrl from '../../api/apiUrls';
import { httpRequest } from '../../utils';

export default defineComponent({
	data() {
		return {
			ImageBaseUrl: this.GlobalImageBaseUrl,
		};
	},
	created() {
		// this.getList();
	},
	methods: {
		getList() {
			httpRequest(
				{
					url: apiUrl.List,
					data: {},
				},
				function (res: any) {
					console.log(res);
				}
			);
		},
	},
});
</script>
<style lang="less">
@import './index.less';
</style>
