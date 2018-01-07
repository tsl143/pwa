import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import store from '../src/reducers/store';
import Add, { AddBase } from '../src/Components/Merchant/Add';

describe('Add Component', () => {
    let wrapper;

    beforeEach(() =>{
        wrapper = mount(<MemoryRouter><Add store={store} /></MemoryRouter>);
    });

    it('should render without errors', () => {
        expect(wrapper.length).toEqual(1);
    });

    it('should render hoder div', () => {
        expect(wrapper.find('.merchantHolder').length).toEqual(1);
    });

    it('should render 6 input holder div', () => {
        expect(wrapper.find('.inputHolder').length).toEqual(6);
    });

    it('should render addBids button', () => {
        expect(wrapper.find('.addBids').length).toEqual(1);
    });

    it('should add .merchantBids block on add bids click', () => {
        wrapper.find('.addBids').simulate('click');
        expect(wrapper.find('.merchantBids').length).toEqual(1);
    });
});