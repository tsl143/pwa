export const validateInput = (value, checks=[]) => {
	if(checks.length===0)
		return true;
	let allSet = true;
	checks.forEach(check => {
		switch(check) {
			case 'required':
				allSet = value && (value.toString().trim() !== '');
			break;
			case 'text':
				allSet = value && /^[a-zA-Z]+$/i.test(value);
			break;
            case 'number':
				allSet = value && !isNaN(Number(value));
			break;
			case 'alphaNumeric':
				allSet = value && /^[a-zA-Z0-9 ]+$/i.test(value);
			break;
			case 'email':
				allSet = value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
			break;
			case 'url':
				allSet = value && /^http[s]?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(value);
			break;
		}
		if(!allSet) return false;
	});
	return allSet;
}

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

export const getFullName = name => {
	if( name.last !== '')
		return name.first + ' ' + name.last;
	else 
		return name.first;
}

export const sortBidsByDate = (obj, sortOrder) => {
	if(obj){
		if(sortOrder && sortOrder == 'DESC'){
			return obj.sort(descCompare);
		}else{
			return obj.sort(ascCompare);	
		}
	}
	else
		return obj;
}

export const getTime = () => {
	const cDate = new Date();
	return cDate.getTime().toString();
}

export const getDateFromTime = (timestamp) => {
	timestamp = parseInt(timestamp, 10);
	const returnDate = new Date(timestamp);
	return returnDate.toString();
}

