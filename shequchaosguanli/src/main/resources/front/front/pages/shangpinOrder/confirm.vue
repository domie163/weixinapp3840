<template>
	<view class="content">
		<form>
			<view @tap="onAddressTap" class="cu-form-group">
				<view class="title">地址</view>
				<view v-if="addresszhi != null" style="height: auto;width: 600rpx;">
					 {{addresszhi.addressDizhi}}（{{addresszhi.addressName}} 收） {{addresszhi.addressPhone}}
				</view>
				<view v-else>
					选择地址
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">购买清单</view>
			</view>
			<view v-for="(item,index) in orderGoods " v-bind:key="index" class="cu-form-group">
				<image class="avator" :src="item.shangpinPhoto" mode=""></image>
				<view class="title">
					<view>{{item.shangpinName}}</view>
					<view >
						x{{item.buyNumber}}
						<text style="margin-left: 30upx;color: red;">￥{{item.shangpinNewMoney}}</text>
					</view>
				</view>
			</view>
			<view @tap="onAddressTap" class="cu-form-group">
				<view class="title">总价</view>
				<view>
					<text>￥{{total}}</text>
				</view>
			</view>
		</form>
		<view class="padding" style="text-align: center;">
			<button @tap="onSubmitTap()" class="bg-red lg">确认支付</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {},
				orderGoods: [],
				addresszhi: {},
				total: 0,
			}
		},
		async onLoad(options) {
			// 获取订单信息，座位信息
			this.orderGoods = uni.getStorageSync('orderGoods');
			if(this.orderGoods.length>0){
				for (let i = 0; i < this.orderGoods.length; i++) {
					this.total += parseFloat(this.orderGoods[i].shangpinNewMoney) * this.orderGoods[i].buyNumber
				}
			}
			uni.removeStorageSync("orderGoods")
		},
		async onShow() {
			let _this = this
			let table = uni.getStorageSync("nowTable");
			let res = await _this.$api.session(table)
			_this.user = res.data
			let address = uni.getStorageSync('address')
			uni.removeStorageSync("address")
			if(address != null && address != ""){
				_this.addresszhi = address
			}else{
				res = await _this.$api.list('address',{
					yonghuId: _this.user.id,
					isdefaultTypes: 2
				});
				if(res.data.list.length > 0){
					_this.addresszhi = res.data.list[0]
				}else{
					_this.addresszhi = null
				}
			}
			
		},
		methods: {
			async onSubmitTap() {
				let _this = this;
				let table = uni.getStorageSync("nowTable");
				uni.showModal({
					title: '提示',
					content: '是否确认支付',
					success: async function(res) {
						if (res.confirm) {
							if(_this.addresszhi != null){
								let data = {
									addressId: _this.addresszhi.id,
									shangpins: JSON.stringify(_this.orderGoods),
									yonghuId: _this.user.id,
									shangpinOrderPaymentTypes: 1,
								}
								await _this.$api.requestConditionData('shangpinOrder','order',null,data);
								_this.$utils.jump('/pages/shangpinOrder/list');
							}else{
								_this.$utils.msg('请选择地址');
								return
							}
						}
					}
				});
			},
			async onAddressTap() {
				let _this = this
				_this.$utils.jump('/pages/address/list');
			}
		}
	}
</script>

<style lang="scss">
	.avator {
		width: 150upx;
		height: 150upx;
		margin: 20upx 0;
	}
</style>
