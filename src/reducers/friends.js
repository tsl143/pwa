export default function ng(state = [], action) {

	const tempState = { ...state }

	switch(action.type) {
		case 'LOADER_FRNDS':
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

				if(list.length > 0) localStorage.setItem('NG_myFriends', JSON.stringify(list) );
				isLoading = false;
			}

			return { ...tempState, list, isLoading, timestamp: Date.now() }
			break;
		
		case 'FRIENDS_LIST_CACHE':
			list = [];
			try {
				const fromCache = localStorage.getItem('NG_myFriends');
				list = JSON.parse(fromCache)
			}catch(e){
				list = [];
			}

			return { ...tempState, list, isLoading: false }
			break;

		default:
			return tempState;
	}
}
