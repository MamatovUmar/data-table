<template>
	<nav class="top-nav">
		<div class="container">
			<div class="top-nav__content">
				<div>Тестовое задание</div>
				<div class="top-nav__links">
					<router-link to="/">Пользовательи</router-link>
					<router-link to="/comments">Комментарии</router-link>
				</div>
			</div>
		</div>
	</nav>
</template>

<script>
export default {
	name: "TopNav",
};
</script>

<style lang="scss">
.top-nav {
	background-color: white;
	border-bottom: 1px solid #e0e0e0;
	&__content {
		height: 60px;
		display: flex;
		align-items: center;
		font-size: 20px;
		color: #1f2f3d;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	&__links {
		font-size: 15px;
		a {
			margin-left: 20px;
			text-decoration: none;
			color: #409eff;
		}
	}
}
</style>
