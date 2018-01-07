import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import React from 'react';

import BidsPopup from '../src/Components/BidsPopup';

const bids = [
    {
      "id": "2",
      "carTitle": "bentle",
      "amount": 1000,
      "created": "1509807708071"
    },
    {
      "id": "3",
      "carTitle": "bentle",
      "amount": 2000,
      "created": "150980770071"
    },
    {
      "id": "4",
      "carTitle": "bentle",
      "amount": 3000,
      "created": "1509807708071"
    },
    {
      "id": "5",
      "carTitle": "bentle",
      "amount": 6000,
      "created": "1509807718071"
    },
    {
      "id": "6",
      "carTitle": "bentle",
      "amount": 8000,
      "created": "1509807718073"
    }
];

describe('BidsPopup Component', () => {

    it('should render without errors', () => {
        const wrapper = shallow(<BidsPopup bids={bids}/>);
      	expect(wrapper.find('.bidPopup').length).toEqual(1);
    });

    it(`should render ${bids.length} bids`, () => {
        const wrapper = shallow(<BidsPopup bids={bids}/>);
        //equals 6 including
        expect(wrapper.find('tr').length).toEqual(6);
    });

    it(`should fire changeSort on click on sortBids`, () => {
        const spy = spyOn(BidsPopup.prototype, "changeSort");
        const wrapper = shallow(<BidsPopup bids={bids}/>);
        wrapper.find('#sortBids').simulate('click');
        expect(spy).toHaveBeenCalled();
    });    

    it(`should change state on changeSort call`, () => {
        const wrapper = shallow(<BidsPopup bids={bids}/>);
        wrapper.instance().changeSort();
        expect(wrapper.state().order).toEqual('ASC');
        wrapper.instance().changeSort();
        expect(wrapper.state().order).toEqual('DESC');
    });
});