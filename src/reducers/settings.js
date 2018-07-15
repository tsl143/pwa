export default function ng(state = [], action) {

	const tempState = { ...state }

	switch(action.type) {
		case 'SHOW_LOADER': {
			return { ...tempState, isLoading: true }
		}
		case 'QUESTIONS': {
			const { questions: qData = {}, answers: aData = {} } = action.payload;
			const { status: qStatus = 0, data: questions = {} } = qData;
			const { status: aStatus = 0, data: answers = {} } = aData;

			if(
				qStatus >= 200 && qStatus <=300 &&
				aStatus >= 200 && aStatus <=300
			) {
				tempState.questions = questions.questions || {}
				tempState.answers = answers.answers || {}
			}
			return { ...tempState, isLoading: false }
		}

		default:
			return tempState;
	}
}
