import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import React from 'react';

import Bids from '../src/Components/Bids';

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

describe('Bids Component', () => {

    it('should render without errors', () => {
        const wrapper = shallow(<Bids />);
      	expect(wrapper.find('#bids').length).toEqual(1);
    });

    it(`should render ${bids.length} bids`, () => {
        const wrapper = shallow(<Bids bids={bids}/>);
        //equals 4 as morebid also has bids class
        expect(wrapper.find('.bids').length).toEqual(4);
    });

    it(`should render 'moreBids' link when bids > 3`, () => {
        const wrapper = shallow(<Bids bids={bids} />);
        expect(wrapper.find('.moreBids').length).toEqual(1);
    });

    it(`should not render 'moreBids' link when bids < 3`, () => {
        bids.splice(0,3)
        const wrapper = shallow(<Bids bids={bids} />);
        expect(wrapper.find('.moreBids').length).toEqual(0);
    });
});