// 是否是老师
export const isTeacher = state => {
	if (!state.user.data) {
		// 未登陆
		return false
	} else {
		if (state.room.room.data !== null) {
			// 普通直播
			return state.room.room.data.TeacherId == state.user.data.Id
		} else if (state.history.teacher !== null) {
			// 历史直播
			return state.history.teacher == state.user.data.Id
		} else {
			return false
		}
	}
}

// 是否是邀请嘉宾
export const isInviteTeacher = state => {
	return state.user.data && state.room.room.inviteTeacher.findIndex(item => item.TeacherId == state.user.data.Id) !== -1
}

// 是否是管理员
export const isManger = state => {
	return state.user.data && state.user.data.UserIdentity == 1
}

// 是否需要启动全局加载动画
export const isLoading = state => {
	return state.user.isLoading || state.room.room.isLoading
}
