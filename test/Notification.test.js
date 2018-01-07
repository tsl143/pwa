import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import React from 'react';

import Notification from '../src/Components/Notification';

describe('Notification Component', () => {

    it('should render without errors', () => {
        const wrapper = shallow(<Notification />);
      	expect(wrapper.find('.notification').length).toEqual(1);
    });

    it('should render a success notification', () => {
        const wrapper = shallow(<Notification type="success"/>);
        expect(wrapper.find('.notification').hasClass('success')).toEqual(true);
    });

    it('should render an error notification', () => {
        const wrapper = shallow(<Notification type="error"/>);
        expect(wrapper.find('.notification').hasClass('error')).toEqual(true);
    });
});