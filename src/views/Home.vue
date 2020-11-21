<template>
	<div class="home" :class="{ loading: loading }">
		<div class="container pt-50 pb-50">
			<button
				type="button"
				class="btn btn__plain mb-30"
				@click="showUsers()"
			>
				Показать пользователей
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
						<h4>{{ selected_row.fullname }}</h4>
						<div
							class="modal__close"
							@click="modal_visible = false"
						>
							x
						</div>
					</div>
					<div class="modal__content">
						<div class="modal__list">
							<strong>Город: </strong>
							<span> {{ selected_row.address.city }} </span>
						</div>
						<div class="modal__list">
							<strong>Адрес: </strong>
							<span>
								{{ selected_row.address.streetAddress }}
							</span>
						</div>
						<div class="modal__list">
							<strong>Почтовый индекс: </strong>
							<span> {{ selected_row.address.zip }} </span>
						</div>
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
				title: "Пользователи", // заголовок таблицы (не обязательно)
				page_size: 10, // количество строк в таблице (не обязательно. по умолчанию - 10)
				columns: [
					{
						label: "Имя", // название колонки
						value: "fullname", // название индекса передаваемого объекта
						width: "250px", // ширина колонки (не обязательно)
					},
					{
						label: "Юзернаме",
						value: "uname",
						width: "200px",
					},
					{
						label: "Компания",
						value: "company",
					},
					{
						label: "E-mail",
						value: "email",
					},
					{
						label: "Штат",
						value: "address.state",
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
		openModal(user) {
			this.modal_visible = true;
			this.selected_row = user;
		},
		async showUsers() {
			try {
				this.loading = true;
				let res = await this.$store.dispatch("getUsers");
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
