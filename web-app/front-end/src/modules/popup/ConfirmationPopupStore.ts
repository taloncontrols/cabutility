import { action, observable } from 'mobx';

export enum ConfirmationPopupValues {
    Confirm = 'confirm',
    Decline = 'decline',
}

export class ConfirmationPopupStore {
    @observable public headerMessage: string;
    @observable public message: string;
    @observable public showConfirmButton: boolean;
    @observable public isOpen = false;
    private resolve: (value: ConfirmationPopupValues) => void;

    @action
    public show(headerMessage: string, message: string, showConfirmButton = true): Promise<ConfirmationPopupValues> {
        if (this.isOpen) {
            this.cancel();
        }

        this.headerMessage = headerMessage;
        this.message = message;
        this.showConfirmButton = showConfirmButton;
        this.isOpen = true;

        return new Promise<ConfirmationPopupValues>((resolve) => {
            this.resolve = resolve;
        });
    }

    @action
    confirm(): void {
        this.resolve(ConfirmationPopupValues.Confirm);
        this.isOpen = false;
    }

    @action
    cancel(): void {
        this.resolve(ConfirmationPopupValues.Decline);
        this.isOpen = false;
    }
}

export default new ConfirmationPopupStore();
