import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import React from 'react';

import Pagination from '../src/Components/Pagination';

describe('Pagination Component', () => {

	const paginate = jest.fn();

    it('should render without errors', () => {
        const wrapper = shallow(<Pagination count={30} pagesCount={3} page={1} paginate={paginate}/>);
      	expect(wrapper.find('div').length).toEqual(1);
    });

    it(`should render ${3} pagination links`, () => {
        const wrapper = shallow(<Pagination count={30} pagesCount={3} page={1} paginate={paginate}/>);      	
      	expect(wrapper.find('a').length).toEqual(3);
    });

	it(`should have only 1 active link`, () => {
        const wrapper = shallow(<Pagination count={30} pagesCount={3} page={1} paginate={paginate}/>);
      	expect(wrapper.find('.active').length).toEqual(1);
    });
});