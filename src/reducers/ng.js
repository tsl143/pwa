export default function ng(state = [], action) {

	const tempState = { ...state }

	switch(action.type) {
		case 'LOADER':
			return { ...tempState, isLoading: true }
			break;
		case 'FRIENDS_LIST':
			let isError = true;
			let isLoading = true;
			let list = [];
			if(
				action.payload &&
				action.payload.status &&
				action.payload.status >= 200 && action.payload.status < 300
			) {
				isError = false;
				const data = action.payload.data.data;
				list = data.filter( entry => {
					return Boolean(entry.channelid);
				});
				isLoading = false;
			}

			return { ...tempState, list, isLoading }
			break;
		
		default:
			return tempState;
	}
}
