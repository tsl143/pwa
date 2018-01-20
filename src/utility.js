const ascCompare = (a,b) => {
	if (a.created < b.created)
		return -1;
	if (a.created > b.created)
		return 1;
	return 0;
}

const descCompare = (a,b) => {
	if (a.lastTime > b.lastTime)
		return -1;
	if (a.lastTime < b.lastTime)
		return 1;
	return 0;
}

export const htmlDecode = msg => {
	try{
		const dummyElement = document.createElement('p');
		dummyElement.innerHTML = msg;
		const renderedContent = dummyElement.textContent;
		return renderedContent;
	}catch(e) {
		return msg;
	}
}

export const sortFriendList = (friends, lastMessage) => {
	const sortedFriends = [];
	if(friends.length !== 0) {
		friends.forEach(friend => {
			const theFriend = { ...friend };
			if(lastMessage && lastMessage[friend.meetingId]) {
				theFriend.lastMsg = lastMessage[friend.meetingId].msg;
				theFriend.lastTime = lastMessage[friend.meetingId].sentTime;
			} else {
				theFriend.lastTime = 0;
			}
			sortedFriends.push(theFriend);
		});
		return sortedFriends.sort(descCompare);
	}
	return friends;
}
