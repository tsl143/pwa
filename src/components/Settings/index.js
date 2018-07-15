import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getQuestions } from '../../actions/settings';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SaveIcon from 'material-ui/svg-icons/content/save';
import MultiSelect from './MultiSelect';
import ButtonSelect from './ButtonSelect';
import TextInput from './TextInput';
import SelectBox from './SelectBox';
import MyCard from './MyCard';
import SetImage from './SetImage';


import Styles from './styles.scss'

class Settings extends Component {

	constructor(props) {
		super(props);
	}

	componentWillReceiveProps(nextProps) {
	}

	componentDidMount() {
		if(document.getElementById('loading')) document.getElementById('loading').remove();
		if(document.getElementById('fullscreen')) document.getElementById('fullscreen').remove();
		this.props.dispatch(getQuestions())
	}

	selectOption(id, val) {
		console.log(id, val)
	}

  	render() {
		const { questions = [], answers = [] } = this.props;
		return (
			<div className={Styles.settingsBox}>
				<FloatingActionButton className={Styles.fab}>
                    <SaveIcon />
                </FloatingActionButton>
				{
					questions.map(q => {
						const { id = "", options, question = "", required = false, subtitle = "", type ="" } = q;
						const answer = answers.find(a => a.id === id);
						switch (type){
							case 'multiSelect': {
								return <MyCard
									title = {question}
									subtitle = {subtitle}
									key={id}
									content={
										<MultiSelect
											key = {id}
											hint = {subtitle}
											data = {options}
											action = {this.selectOption.bind(this, id)}
											answer = {answer}
										/>
									}
								/>
							}

							case 'buttonSelect': {
								return <MyCard
									title = {question}
									subtitle = {subtitle}
									key={id}
									content={
										<ButtonSelect
											key = {id}
											hint = {subtitle}
											data = {options}
											action = {this.selectOption.bind(this, id)}
											answer = {answer}
										/>
									}
								/>
							}

							case 'selectBox': {
								return <MyCard
									title = {question}
									subtitle = {subtitle}
									key={id}
									content={
										<SelectBox
											id={id}
											hint = {subtitle}
											data = {options}
											action = {this.selectOption.bind(this, id)}
											answer = {answer}
										/>
									}
								/>
							}
							case 'textField': {
								return <MyCard
									title = {question}
									subtitle = {subtitle}
									key={id}
									content={
										<TextInput
											id={id}
											hint = {subtitle}
											action = {this.selectOption.bind(this, id)}
											answer = {answer}
										/>
									}
								/>
							}
							case 'image': {
								return <MyCard
									title = {question}
									key={id}
									content={
										<SetImage
											id={id}
											hint = {subtitle}
											action = {this.selectOption.bind(this, id)}
											answer = {answer}
										/>
									}
								/>
							}
						}
					})
				}
			</div>
		)
  	}
}

const mapStateToProps = state => {
	
    return {
		questions: state.settings.questions || [],
		answers: state.settings.answers || {},
    }
}

export default connect(mapStateToProps)(Settings);
