import ConfirmationPopup from './ConfirmationPopup';
import confirmationPopupStore, { ConfirmationPopupValues } from './ConfirmationPopupStore';

ConfirmationPopup.create();

export default {
    show: (headerMessage: string, message: string, showConfirmButton = true): Promise<ConfirmationPopupValues> => confirmationPopupStore.show(headerMessage, message, showConfirmButton),
}
