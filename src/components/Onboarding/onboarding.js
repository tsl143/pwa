import React, {Component} from 'react'
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Geosuggest from 'react-geosuggest';
import { parseNumber, formatNumber, AsYouType } from 'libphonenumber-js'
import Fontawesome from 'react-fontawesome'
import { saveOnboardingData } from '../../actions/login';

import Styles from './style.css';

const styles = (theme) => ({
  stepper: {
    width: '100vw',
    flexGrow: 1,
    bottom: 0,
    position: 'absolute'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  menu: {
    width: 200,
  },
  input: {
    display: 'none',
  }
});

const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
];

class Onboarding extends Component {
  constructor(props) {
    super(props)
    this.state = {
      onboardSteps: ['gender', 'match_gender', 'age', 'location', 'image', 'phoneNo'],
      activeStep: 1,
      activeStepName: 'gender',
      onboardingData : {
        gender: '',
        match_gender: '',
        age: '',
        location: {},
        phoneNo: '+',
        image: 'https://img.neargroup.in/60x60/forcesize/demo_boy',
      }
    }

    this.handleBack = this.handleBack.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleGenderChange = this.handleGenderChange.bind(this)
    this.handleMatchGenderChange = this.handleMatchGenderChange.bind(this)
    this.handleAgeChange = this.handleAgeChange.bind(this)
    this.handleLocationSelect = this.handleLocationSelect.bind(this)
    this.handlePhoneChange = this.handlePhoneChange.bind(this)
    this.handleUploadFile = this.handleUploadFile.bind(this)
  }

  componentDidMount() {
    console.log("onboarding will mount");
    // var resource = document.createElement('link');
    // resource.setAttribute("rel", "stylesheet");
    // resource.setAttribute("href","https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
    // resource.setAttribute("type","text/css");
    // var head = document.getElementsByTagName('head')[0];
    // head.appendChild(resource);
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps  onboarding = ', nextProps);
    this.setState({onboardingData: nextProps.onboardingData})
  }

  handleNext () {
    let newStep = this.state.activeStep + 1
    this.setState({
      activeStep: newStep,
      activeStepName: this.state.onboardSteps[newStep-1]
    }, () => {
      console.log("next setState= ", this.state);
    });
  };

  handleBack () {
    let newStep = this.state.activeStep - 1
    this.setState({
      activeStep: newStep,
      activeStepName: this.state.onboardSteps[newStep-1]
    }, () => {
      console.log("back setState= ", this.state);
    });
  };

  handleGenderChange(e) {
    let {onboardingData} = this.state
    onboardingData["gender"] = e.target.value
    this.setState({onboardingData})
  }

  handleMatchGenderChange(e) {
    let {onboardingData} = this.state
    onboardingData["match_gender"] = e.target.value
    this.setState({onboardingData})
    // this.setState({match_gender: e.target.value}, () => {
    //   console.log('handleMatchGenderChange set ', this.state);
    // })
  }

  handleAgeChange(e) {
    let {onboardingData} = this.state
    onboardingData["age"] = e.target.value
    this.setState({onboardingData})
    // this.setState({age: e.target.value})
  }

  handleLocationSelect(e) {
    console.log('handleLocationSelect= ', e);
    let {onboardingData} = this.state
    onboardingData["location"] = e
    this.setState({onboardingData})

    // this.setState({location: e.target.result})
  }

  handlePhoneChange(e) {
    let phone = '+' + e.target.value.toString()
    console.log("phone change= ", phone);
    let {onboardingData} = this.state
    onboardingData["phoneNo"] = e.target.value
    this.setState({onboardingData})
    // this.setState({phoneNo: phone})
    console.log('phoneNo parse', parseNumber(phone));
  }

  handleUploadFile(e) {
    console.log('handleUploadFile = ', e.target.value, e.target.files, e.target.result);
    let {onboardingData} = this.state
    onboardingData["image"] = e.target.value
    this.setState({onboardingData})
    // this.setState({image: e.target.value})
  }

  handleDataChange(e, type) {
    console.log('handleDataChange = ', type);
    let {onboardingData} = this.state
    if(type == 'location') {
      onboardingData[type] = e
    } else {
      onboardingData[type] = e.target.value
    }
    this.setState({onboardingData})
  }

  render() {
    console.log("state in render= ", this.state);
    const { classes, theme } = this.props;
    const { onboardSteps, activeStepName } = this.state
    return (
      <div>
        <div className={Styles.OnboardContainer}>
          <Grid container alignContent='center' spacing={24}>
            {
              activeStepName == 'gender' &&
            (<Grid item xs={12} style={{padding: "25% 20%"}}>
              <Fade in={activeStepName == 'gender'} style={{textAlign: 'center'}}>
                <div>
                  <div style={{ textAlign: 'center'}}><h2>Gender</h2></div>
                  <FormControl component="fieldset" required error className={classes.formControl}>
                    <RadioGroup
                      aria-label="gender"
                      name="gender2"
                      className={classes.group}
                      value={this.state.onboardingData.gender}
                      onChange={e => this.handleDataChange(e, 'gender')}
                    >
                      <FormControlLabel value="female" control={<Radio color="primary" />} label="Female" />
                      <FormControlLabel value="male" control={<Radio color="primary" />} label="Male" />
                    </RadioGroup>
                  </FormControl>
                </div>
              </Fade>
            </Grid>)}
            {activeStepName == 'match_gender' &&
            (<Grid item xs={12} style={{padding: "25% 20%"}}>
              <Fade in={activeStepName == 'match_gender'} style={{textAlign: 'center'}}>
                <div>
                  <div style={{ textAlign: 'center'}}><h2>Match Gender</h2></div>
                  <FormControl component="fieldset" required error className={classes.formControl}>
                    <RadioGroup
                      aria-label="gender"
                      name="match_gender"
                      className={classes.group}
                      value={this.state.onboardingData.match_gender}
                      onChange={e => this.handleDataChange(e, 'match_gender') }
                    >
                      <FormControlLabel value="female" control={<Radio color="primary" />} label="Female" />
                      <FormControlLabel value="male" control={<Radio color="primary" />} label="Male" />
                      <FormControlLabel value="anyone" control={<Radio color="primary" />} label="Anyone" />
                    </RadioGroup>
                  </FormControl>
                </div>
              </Fade>
            </Grid>)}
            {activeStepName == 'age' &&
            (<Grid item xs={12} style={{padding: "25% 20%"}}>
              <Fade in={activeStepName == 'age'}>
                <div>
                <div style={{ textAlign: 'center'}}><h2>Birth Year</h2></div>
                  {/**
                  <form className={classes.container} noValidate autoComplete="off">
                    <TextField
                      id="helperText"
                      label="Helper text"
                      defaultValue="Default Value"
                      className={classes.textField}
                      helperText="Some important text"
                      margin="normal"
                    />
                  </form>
                  **/}
                  <div style={{textAlign: 'center'}}>
                    <TextField
                     id="select-currency-native"
                     select
                     label="Select"
                     className={classes.textField}
                     value={this.state.onboardingData.age}
                     onChange={e => this.handleDataChange(e, 'age')}
                     SelectProps={{
                       MenuProps: {
                         className: classes.menu,
                       },
                     }}
                     helperText="Please select your currency"
                     margin="normal"
                     style={{textAlign: 'left'}}
                    >
                   {currencies.map(option => (
                     <option key={option.value} value={option.value}>
                       {option.label}
                     </option>
                   ))}
                 </TextField>
                </div>
            {/***
               **/}
               </div>
              </Fade>
            </Grid>)}
            {activeStepName == 'location' &&
            (<Grid item xs={12} style={{padding: "25% 0%"}}>
              <Fade in={activeStepName == 'location'}>
                <div>
                  <div style={{ textAlign: 'center'}}><h2>Location</h2></div>
                  <div style={{textAlign: 'center'}}>
                    <Geosuggest onSuggestSelect={ e => this.handleDataChange(e, 'location')}/>
                  </div>
                </div>
              </Fade>
            </Grid>)}
            {activeStepName == 'image' &&
            (<Grid item xs={12} style={{padding: "25% 0%"}}>
              <Fade in={activeStepName == 'image'}>
                <div>
                  <div style={{ textAlign: 'center'}}><h2>Profile Picture</h2></div>
                  <div style={{textAlign: 'center'}}>
                    <img src={this.state.image} className={Styles.uploadImg} />
                    {/** <Fontawesome name='plus' style={{position: 'absolute', margin: 'auto'}} /> **/}
                  </div>
                  <div style={{textAlign: 'center'}}>
                    <input
                      accept="image/*"
                      className={classes.input}
                      id="flat-button-file"
                      type="file"
                      onChange={this.handleUploadFile}
                    />
                    <label htmlFor="flat-button-file">
                      <Button component="span" className={classes.button}>Upload</Button>
                    </label>
                  </div>
                </div>
              </Fade>
            </Grid>)}
            {activeStepName == 'phoneNo' &&
            (<Grid item xs={12} style={{padding: "25% 20%"}}>
              <Fade in={activeStepName == 'phoneNo'}>
                <div>
                  <div style={{ textAlign: 'center'}}><h2>Mobile No</h2></div>
                  <div style={{textAlign: 'center'}}>
                    <TextField
                      label="With normal TextField"
                      id="simple-start-adornment"
                      onChange={this.handlePhoneChange}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">+</InputAdornment>,
                      }}
                    />
                  </div>
                </div>
              </Fade>
            </Grid>)}
          </Grid>
        </div>
        <MobileStepper
          variant="progress"
          steps={onboardSteps.length + 1}
          position="static"
          activeStep={this.state.activeStep}
          className={classes.stepper}
          nextButton={
            <Button size="small" onClick={this.handleNext} disabled={this.state.activeStep === onboardSteps.length}>
              Next
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" onClick={this.handleBack} disabled={this.state.activeStep === 0}>
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  console.log("mapStateToProps in onboarding= ", state);
    return {
        me: state.friends.me || {},
        fcmToken: state.login.fcmToken || null,
        login: state.login.login || {},
        onboardingData: state.login.onboardingData || {}
    }
}

const mapDispatchToProps = dispatch => {
    return {
        // getFriends: authId => {
        //     dispatch(getFriends(authId));
        // },
        // getFriendsCache: () => {
        //     dispatch(getFriendsCache());
        // },
        // getFriendsChat: (channelId, newFriends) => {
        //     dispatch(getFriendsChat(channelId, newFriends));
        // },
        // getLastMsg: (id, msg) => {
        //     dispatch(getLastMsg(id, msg));
        // },
        // setUnreadChatCount: (id, count, msg) => {
        //     dispatch(setUnreadChatCount(id, count, msg));
        // },
        // processChat: (obj, meetingid,  me, isOtherOnline) => {
        //   dispatch(processChat(obj, meetingid, me, isOtherOnline));
        // },
        saveOnboardingData: (data) => {
          dispatch(saveOnboardingData(data));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Onboarding))
