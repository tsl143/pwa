import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import React from 'react';

import Grid from '../src/Components/Grid';
import TableRow from '../src/Components/TableRow';


describe('Grid Component', () => {

    it('should render without errors', () => {
        const wrapper = shallow(<Grid />);
      	expect(wrapper.find('table').length).toEqual(1);
    });

    it('should have a TableRow', () => {
        const wrapper = shallow(<Grid />);
      	expect(wrapper.find(TableRow).length).toEqual(1);
    });

});