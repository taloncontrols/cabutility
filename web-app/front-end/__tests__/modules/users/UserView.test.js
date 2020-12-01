import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'mobx-react';

import UserView from 'users/UserView';
import confirmationPopupService from 'popup/confirmationPopupService';
import { ConfirmationPopupValues } from 'popup/ConfirmationPopupStore';
import { PermissionValue } from 'permissions/config';

describe('User', function () {
    this.getWrapper = () => {
        return mount(<Provider permissionStore={this.permissionStore}><UserView id={ this.store.id } userStore={ this.store } routingStore={this.routingStore} /></Provider>);
    }

    this.confirmationPopupService = jest.mock('popup/confirmationPopupService', () => jest.fn());

    beforeEach(() => {
        this.store = {
            isActive: true,
            firstName: 'Test',
            lastName: 'Tester',
            fullName: 'Test, Tester',
            id: 'some_id',
            setId() {},
            deactivate() {
                this.isActive = false;
            },
        };

        this.routingStore = {
            push: () => {},
        };

        this.permissionStore = {
            hasPermission: () => true,
        };

        confirmationPopupService.show = jest.fn().mockResolvedValue(ConfirmationPopupValues.Confirm);
    });

    it('should show fullName in header', () => {
        const wrapper = this.getWrapper();

        expect(wrapper.find('h2').at(0).text()).toBe('Test, Tester');
    });

    it('should render buttons when active', () => {
        const wrapper = this.getWrapper();

        expect(wrapper.find('.btn')).toHaveLength(2);
    });

    it('should render disabled Archive button when user is not active', () => {
        this.store.isActive = false;

        const wrapper = this.getWrapper();
        expect(wrapper.find('button')).toHaveLength(2);
        expect(wrapper.find('button').at(1).hasClass('disabled')).toBeTruthy();
    });

    it('should disable archiveButton when it being clicked', async () => {
        const wrapper = this.getWrapper();

        expect(wrapper.find('button').at(1).hasClass('disabled')).toBeFalsy();

        wrapper.find('button').at(1).simulate('click');

        expect(confirmationPopupService.show).toBeCalled();
        await confirmationPopupService.show();

        const updatedWrapper = this.getWrapper();
        expect(updatedWrapper.find('button').at(1).hasClass('disabled')).toBeTruthy();
    });
})

