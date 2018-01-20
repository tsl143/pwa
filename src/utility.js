const ascCompare = (a,b) => {
	if (a.created < b.created)
		return -1;
	if (a.created > b.created)
		return 1;
	return 0;
}

const descCompare = (a,b) => {
	if (a.created > b.created)
		return -1;
	if (a.created < b.created)
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
