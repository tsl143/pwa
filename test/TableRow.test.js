import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import React from 'react';

import store from '../src/reducers/store';
import TableRow from '../src/Components/TableRow';

const props = { 
	merchants: {
		dataList: [],
        count: 0,
        page: 1,
        delete: false,
	} ,
	getMerchants: jest.fn(),
}

describe('TableRow Component', () => {

    it('should render without errors', () => {
        const wrapper = mount(<TableRow { ...props } />, { context: { store } });
      	expect(wrapper.length).toEqual(1);
    });

    it('should render a tbody', () => {
        const wrapper = mount(<TableRow { ...props } />, { context: { store } });
      	expect(wrapper.find('tbody').length).toEqual(1);
    });

});