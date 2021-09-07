<template>
	<div id="Publication">
		<div v-if="this.$route.query.messageId">
			<MessageReading />
		</div>
		<div v-else>
			<MessageWriting />
		</div>
	</div>
</template>

<script>

import MessageReading from '@/components/MessageReading.vue';
import MessageWriting from '@/components/MessageWriting.vue';

export default {
	name: "Publication",
		data() {
			return {
				}
		},
	components:{
		MessageReading,
		MessageWriting,
	},
 
}
</script>

<style></style>
