<template>
	<div class="data-table">
		<!-- table header -->
		<div class="data-table__header">
			<span class="data-table__title"> {{ options.title }} </span>
			<div class="data-table__search">
				<input type="text" v-model="search" placeholder="Поиск" />
			</div>
		</div>
		<!-- table header -->

		<div class="data-table__body">
			<!-- table body -->
			<table class="table" border="0" cellspacing="0" cellpadding="0">
				<thead v-if="options.columns">
					<tr class="table__hrow" v-if="options.columns.length">
						<th style="width:60px"></th>
						<th
							v-for="(col, l) of options.columns"
							:key="`col-${l}`"
							:style="`width: ${col.width || 'auto'}`"
						>
							<div
								class="cell table__sort"
								:class="{
									table__sort_active:
										sorting.column == col.value &&
										sorting.type == 1,
									table__sort_desc:
										sorting.column == col.value &&
										sorting.type == -1,
								}"
								@click="sortBy(col.value)"
							>
								{{ col.label }}
							</div>
						</th>
					</tr>
				</thead>
				<tbody v-if="is_visible">
					<tr
						class="table__row"
						v-for="(user, k) of show_data"
						:key="`u-${k}`"
						@click="$emit('selectedRow', user)"
					>
						<td>
							<div class="cell">
								{{ pageBegin + k + 1 }}
							</div>
						</td>
						<td v-for="(col, j) of options.columns" :key="j">
							<div class="cell">
								{{ getUserData(user, col.value) }}
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<!-- table body -->

			<div
				class="data-table__empty"
				v-html="error_message"
				v-if="!is_visible"
			></div>

			<div class="data-table__summary" v-if="is_visible">
				Показаны записи {{ pageBegin + 1 }}-{{
					clone_data.length < options.page_size
						? clone_data.length
						: pageEnd
				}}
				из {{ data.length }}.
			</div>

			<!-- pagination -->
			<ul class="pagination" v-if="is_visible">
				<li
					class="pagination__padding"
					:class="{ disable: active_page == 1 }"
					@click="toBegin()"
				>
					в начало
				</li>

				<li :class="{ disable: active_page == 1 }" @click="prev()">
					&lt;
				</li>

				<li
					v-for="i in pagination_length > 10 ? 10 : pagination_length"
					:key="`p-${i}`"
					:class="{
						active: paginationInterval(i) == active_page,
					}"
					@click="selectPage(paginationInterval(i))"
				>
					{{ paginationInterval(i) }}
				</li>

				<li
					:class="{ disable: active_page == pagination_length }"
					@click="next()"
				>
					&gt;
				</li>

				<li
					class="pagination__padding"
					:class="{ disable: active_page == pagination_length }"
					@click="toEnd()"
				>
					в конец
				</li>
			</ul>
			<!-- pagination -->
		</div>
	</div>
</template>

<script>
export default {
	name: "DataTable",
	props: {
		data: {
			default: [],
		},
		options: {
			default: {
				title: "",
				page_size: 10,
				columns: [],
			},
		},
	},
	data() {
		return {
			search: "",
			active_page: 1,
			error_message: "",
			clone_data: [],
			sorting: {
				column: "",
				type: 1,
			},
		};
	},

	methods: {
		sortBy(column) {
			if (this.sorting.column == column) {
				this.sorting.type = -this.sorting.type;
				this.data.sort((a, b) =>
					a[column] > b[column]
						? this.sorting.type
						: -this.sorting.type
				);
			} else {
				this.sorting = {
					column: column,
					type: 1,
				};
				this.data.sort((a, b) => (a[column] > b[column] ? 1 : -1));
			}
		},
		getUserData(user, column) {
			let arr = column.split(".");
			let s = user;
			for (let item of arr) {
				if (s[item]) {
					s = s[item];
				} else {
					this.error_message = `Поле <i>${column}</i> не найдено`;
					return false;
				}
			}
			return s;
		},
		selectPage(i) {
			this.active_page = i;
		},
		toBegin() {
			this.active_page = 1;
		},
		toEnd() {
			this.active_page = this.pagination_length;
		},
		prev() {
			if (this.active_page > 1) {
				this.active_page--;
			}
		},
		next() {
			if (this.active_page < this.pagination_length) {
				this.active_page++;
			}
		},
		paginationInterval(i) {
			if (this.pagination_length < 10) {
				return i;
			} else if (this.active_page > this.pagination_length - 5) {
				return i + this.pagination_length - 10;
			} else if (this.active_page > 6) {
				return this.active_page - 5 + i;
			} else {
				return i;
			}
		},
	},
	computed: {
		is_visible() {
			this.error_message = "";
			if (this.data.length) {
				for (let col of this.options.columns) {
					if (!this.getUserData(this.data[0], col.value)) {
						break;
					}
				}
			} else {
				this.error_message = "Нет данных";
			}
			if (!this.options.columns || !this.options.columns.length) {
				this.error_message = `Введите данные <i>options.columns</i>`;
			}
			return !Boolean(this.error_message);
		},
		pagination_length() {
			return Math.ceil(this.clone_data.length / this.options.page_size);
		},

		pageBegin() {
			return this.options.page_size * (this.active_page - 1);
		},

		pageEnd() {
			return this.active_page * this.options.page_size;
		},

		show_data() {
			this.clone_data = this.data;
			if (this.search) {
				this.clone_data = this.data.filter((elem) => {
					let arr = [];
					for (let col of this.options.columns) {
						arr.push(this.getUserData(elem, col.value));
					}
					let str = JSON.stringify(arr);
					if (
						str
							.toLowerCase()
							.search(this.search.trim().toLowerCase()) > 0
					) {
						return true;
					} else {
						return false;
					}
				});
			}
			let d = [];
			if (this.clone_data.length) {
				for (let i = this.pageBegin; i < this.pageEnd; i++) {
					if (this.clone_data[i]) {
						d.push(this.clone_data[i]);
					}
				}
			}
			return d;
		},
	},
};
</script>

<style lang="scss">
.pagination {
	list-style-type: none;
	display: flex;
	align-items: center;
	margin-top: 35px;
	justify-content: center;
	li {
		margin: 0 3px;
		background-color: #f4f4f5;
		color: #606266;
		min-width: 28px;
		border-radius: 2px;
		padding: 0 4px;
		vertical-align: top;
		font-size: 13px;
		height: 28px;
		line-height: 28px;
		cursor: pointer;
		box-sizing: border-box;
		text-align: center;
		transition: 0.3s;
		user-select: none;
		&:hover,
		&.active {
			background: #409eff;
			color: white;
		}
		&.disable {
			background-color: #f4f4f5;
			color: #c0c4cc;
			cursor: not-allowed;
		}
	}
	&__padding {
		padding-left: 10px !important;
		padding-right: 10px !important;
	}
}

.table {
	color: #606266;
	text-align: left;
	border: none;
	width: 100%;
	.cell {
		padding-left: 10px;
		padding-right: 15px;
		display: inline;
	}
	&__sort {
		cursor: pointer;
		position: relative;
		&::after {
			display: none;
			content: "";
			width: 0;
			height: 0;
			border: 5px solid transparent;
			position: absolute;
			right: 0px;
			border-top-color: #c0c4cc;
			top: 35%;
		}
		&_active {
			&::after {
				border-top-color: #409eff;
			}
		}
		&_desc {
			&::after {
				border-top-color: transparent;
				border-bottom-color: #409eff;
				top: 9%;
			}
		}

		&:hover {
			&::after {
				display: block;
			}
		}
	}
	&__row {
		cursor: pointer;
		&:hover {
			background: #f5f7fa;
		}
		td {
			border-bottom: 1px solid #ebeef5;
			padding-top: 15px;
			padding-bottom: 15px;
			font-size: 14px;
		}
	}
	&__hrow {
		margin-bottom: 10px;
		th {
			border-bottom: 1px solid #ebeef5;
			padding-bottom: 15px;
			font-size: 14px;
			user-select: none;
		}
	}
}
.data-table {
	border: 1px solid #ebebeb;
	border-radius: 3px;
	transition: 0.2s;
	padding: 20px;
	background-color: white;
	&__summary {
		font-size: 12px;
		margin-top: 20px;
		color: #606266;
	}
	&__empty {
		color: #606266;
		padding-top: 30px;
		padding-bottom: 30px;
		text-align: center;
		font-size: 14px;
	}
	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 10px;
		margin-bottom: 20px;
	}
	&__title {
		font-size: 18px;
		color: #1f2f3d;
	}
	&__search {
		input {
			background-color: #fff;
			background-image: none;
			border-radius: 4px;
			border: 1px solid #dcdfe6;
			box-sizing: border-box;
			color: #606266;
			height: 32px;
			font-size: 14px;
			padding-left: 10px;
			padding-right: 10px;
			&:focus,
			&:active {
				outline: none;
			}
		}
	}
}
</style>
