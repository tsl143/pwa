export default function ng(state = {
	location: null,
	fcmToken: null
}, action) {

	const tempState = { ...state }

	switch(action.type) {

		case 'SAVE_LOGIN':
			let login = null, isLoggedIn = false
      if(action.payload != null || action.payload != undefined) {
        login = action.payload
				isLoggedIn = true
      }
      console.log('SAVE_LOGIN = ', login, action.payload);
			return { ...tempState, login, isLoggedIn }
			break;
		case 'SAVE_LOCATION':
			let location = {}
      if(action.payload != null || action.payload != undefined) {
        location = action.payload
      }
      console.log('SAVE_LOCATION = ', location, action.payload);
			return { ...tempState, location }
			break;
			case 'SAVE_FCM_TOKEN':
				let fcmToken = {}
	      if(action.payload != null || action.payload != undefined) {
	        fcmToken = action.payload
	      }
	      console.log('SAVE_FCM_TOKEN = ', fcmToken, action.payload);
				return { ...tempState, fcmToken }
				break;
			case 'SAVE_ONBOARDING':
			console.log('SAVE_ONBOARDING= ', action.payload);
				let onboardingData= tempState.onboardingData ? tempState.onboardingData : {}
	      onboardingData[action.payload.type] = action.payload.value
				console.log('new onboardingData= ', onboardingData);
				return { ...tempState, onboardingData }
			break;
			case 'SAVE_CHANNELID':
			console.log('SAVE_CHANNELID= ', action.payload);

				return { ...tempState, channelId: action.payload }
			break;
			case 'ADD_BOT_DATA':
				console.log('ADD_BOT_DATA= ', action.payload);
				let newBotData = tempState.botData ? tempState.botData : []
				newBotData.push(action.payload)
				return { ...tempState, botData: newBotData }
			break;

		default:
			return tempState;
	}
}
