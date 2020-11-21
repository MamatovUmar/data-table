<template>
	<div class="home" :class="{ loading: loading }">
		<div class="container pt-50 pb-50">
			<button
				type="button"
				class="btn btn__plain mb-30"
				@click="showComments()"
			>
				Показать коментарии
			</button>

			<data-table
				:data="data"
				:options="tableOptions"
				@selectedRow="openModal($event)"
			/>

			<div class="modal" v-if="modal_visible">
				<div class="modal__bg" @click="modal_visible = false"></div>
				<div class="modal__body">
					<div class="modal__header">
						<h4>{{ selected_row.name }}</h4>
						<div
							class="modal__close"
							@click="modal_visible = false"
						>
							x
						</div>
					</div>
					<div class="modal__content">
						{{ selected_row.body }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import DataTable from "@/components/DataTable.vue";

export default {
	name: "Home",
	components: {
		DataTable,
	},
	data() {
		return {
			loading: false,
			data: [],
			selected_row: "",
			modal_visible: false,
			tableOptions: {
				title: "Коментарии",
				page_size: 15,
				columns: [
					{
						label: "Имя",
						value: "name",
					},
					{
						label: "E-mail",
						value: "email",
					},
				],
			},
		};
	},
	mounted() {
		document.addEventListener("keyup", this.hideModal);
	},

	methods: {
		hideModal(e) {
			if (e.keyCode == 27) {
				this.modal_visible = false;
			}
		},
		openModal(comment) {
			this.modal_visible = true;
			this.selected_row = comment;
		},
		async showComments() {
			try {
				this.loading = true;
				let res = await this.$store.dispatch("getComments");
				this.loading = false;
				this.data = res;
			} catch (er) {
				console.error(er);
			}
		},
	},
};
</script>
<style lang="scss">
.pt-50 {
	padding-top: 50px;
}
.pb-50 {
	padding-bottom: 50px;
}
.mb-30 {
	margin-bottom: 30px;
}
</style>
