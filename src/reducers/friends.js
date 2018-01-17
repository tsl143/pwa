export default function ng(state = [], action) {

	const tempState = { ...state };
	let friends;
	let me;

	switch(action.type) {
		case 'LOADER_FRNDS':
			return { ...tempState, isLoading: true }
			break;
		case 'FRIENDS_LIST':
			let isError = true;
			let isLoading = true;
			if(
				action.payload &&
				action.payload.status &&
				action.payload.data &&
				action.payload.status >= 200 && action.payload.status < 300
			) {
				isError = false;
				friends = action.payload.data.friends;
				me = action.payload.data.me;

				if(friends && friends.length > 0) localStorage.setItem('NG_PWA_friendsList', JSON.stringify(action.payload.data) );
				isLoading = false;
			}

			return { ...tempState, friends, me, isLoading, timestamp: Date.now() }
			break;

		case 'SENT':
			return { ...tempState }
			break;

		case 'LAST_MSG':
		console.log(action.payload)
			return { ...tempState }
			break;

		case 'FRIENDS_LIST_CACHE':
			try {
				const fromCache = localStorage.getItem('NG_PWA_friendsList');
				data = JSON.parse(fromCache)
				me = data.me;
				friends = data.friends;
			}catch(e){}

			return { ...tempState, friends, me, isLoading: false }
			break;

		default:
			return tempState;
	}
}
