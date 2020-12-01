import UserStore from 'users/UserStore';
import * as userDataService from 'users/userDataService';

const roleStore = jest.createMockFromModule('roles/RoleStore');
roleStore.getFirstAvailableRoleName = jest.fn(() => 'default role');

describe('UserStore', () => {
    let userStore;

    beforeEach(() => {
        userStore = new UserStore(roleStore);
        jest.mock('users/userDataService', () => jest.fn());
    });

    it('should generate FullName when setting First Name and Last Name', () => {
        userStore.setFirstName('Test');
        expect(userStore.firstName).toBe('Test');
        expect(userStore.fullName).toBe('Test, ');

        userStore.setLastName('Tester');
        expect(userStore.lastName).toBe('Tester');
        expect(userStore.fullName).toBe('Test, Tester');
    });

    it('should populate store with default values when emptyStore called', () => {
        userStore.setFirstName('Test');
        userStore.setLastName('Tester');

        userStore.emptyStore();
        expect(userStore.firstName).toBe('');
        expect(userStore.lastName).toBe('');
    });

    it('should have new data after called', async () => {
        userDataService.getUser = jest.fn().mockResolvedValue({
            firstName: 'Test',
            lastName: 'Tester',
            id: '1'
        });
        userStore.setId('1');

        await userDataService.getUser;
        expect(userStore.firstName).toBe('Test');
        expect(userStore.lastName).toBe('Tester');
        expect(userStore.id).toBe('1');
    })
});
