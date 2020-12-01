import { shallow } from 'enzyme';
import React from 'react';
import FiltersBody, { FiltersConfigType } from 'filters/FiltersBody';

describe('FiltersBody', function () {
    this.getWrapper = () => {
        return shallow(<FiltersBody store={ this.store } filtersConfig={ this.filtersConfig } />);
    }

    beforeEach(() => {
        this.store = {
            isFiltersVisible: true,
            setFilterValue: (filterName, filterValue) => {
                this.filters[filterName] = filterValue;
            },
            refreshData: jest.fn(),
            filters: {},
        };

        this.filtersConfig = [];
    });

    it('should not be visible when isVisible false', () => {
        this.store.isFiltersVisible = false;
        const wrapper = this.getWrapper();

        expect(wrapper.find('.filtersBody')).toHaveLength(0);
    });

    it('should be visible when isVisible true', () => {
        const wrapper = this.getWrapper();

        expect(wrapper.find('.filtersBody')).toHaveLength(1);
    });

    it('should correct render filters of type text', () => {
        this.filtersConfig = [{
            type: FiltersConfigType.Text,
            label: 'Full Name',
            fieldName: 'fullName',
        }];

        const wrapper = this.getWrapper();

        expect(wrapper.find('[type="text"]')).toHaveLength(1);
        expect(wrapper.find('[placeholder="Full Name"]')).toHaveLength(1);
    });

    it('should correct render filters of type dropdown', () => {
        this.filtersConfig = [{
            type: FiltersConfigType.Dropdown,
            label: 'User Group',
            fieldName: 'role',
            values: [{ id: 1, name: 'test' }, { id: 2, name: 'second test' }, { id: 3, name: 'third test' }],
        }];

        const wrapper = this.getWrapper();

        expect(wrapper.find('[type="select"]')).toHaveLength(1);
        expect(wrapper.find('option').find('[value="-1"]').hasClass('placeholderLabel')).toBeTruthy();
        expect(wrapper.find('option')).toHaveLength(4);
    });

    it('should correct render filters of type boolean', () => {
        this.filtersConfig = [{
            type: FiltersConfigType.Boolean,
                label: 'Status',
            fieldName: 'isActive',
            trueLabel: 'Active',
            falseValue: 'Inactive',
        }];

        const wrapper = this.getWrapper();

        expect(wrapper.find('[type="select"]')).toHaveLength(1);
        expect(wrapper.find('option')).toHaveLength(3);
        expect(wrapper.find('option').find('[value="-1"]').hasClass('placeholderLabel')).toBeTruthy();
        expect(wrapper.find('option').at(0).is('[value="-1"]')).toBeTruthy();
        expect(wrapper.find('option').at(1).is('[value="1"]')).toBeTruthy();
        expect(wrapper.find('option').at(2).is('[value="0"]')).toBeTruthy();
    })
});
