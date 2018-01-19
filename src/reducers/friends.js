export default function ng(state = [], action) {

	const tempState = { ...state };
	let friends;
	let me;
	let lastChats = {};

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

			return { ...tempState, friends, me, isLoading, timestamp: Date.now(), lastChats, noReload: true }
			break;

		case 'SENT':
			return { ...tempState }
			break;

		case 'LAST_MSG':
			lastChats = { ...tempState.lastChats };
			lastChats[action.payload.id] = action.payload.msg;
			localStorage.setItem('NG_PWA_LAST_MSG', JSON.stringify(lastChats));
			return { ...tempState, lastChats }
			break;

		case 'FRIENDS_LIST_CACHE':
			try {
				const fromCache = localStorage.getItem('NG_PWA_friendsList');
				const data = JSON.parse(fromCache);
				me = data.me;
				friends = data.friends;
				lastChats = JSON.parse(localStorage.getItem('NG_PWA_LAST_MSG'));
			}catch(e){}

			return { ...tempState, friends, me, lastChats, isLoading: false }
			break;

		case 'SET_MEETING':
			const friendData = [ ...tempState.friends ];
			const meetingId = action.payload;
			const meetingData = friendData.find(friend => friend.meetingId == meetingId);
			return { ...tempState, meetingData }
			break;

		default:
			return tempState;
	}
}
