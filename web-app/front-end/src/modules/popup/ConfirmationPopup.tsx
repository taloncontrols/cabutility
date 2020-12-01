import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import confirmationPopupStore, { ConfirmationPopupStore } from './ConfirmationPopupStore';
import './confirmationPopup.scss';
import { Button } from 'reactstrap';

interface IConfirmationPopupProps {
    store?: ConfirmationPopupStore;
}

@observer
export default class ConfirmationPopup extends React.Component<IConfirmationPopupProps> {
    static defaultProps = {
        store: confirmationPopupStore,
    }

    static create(): void {
        const containerElement = document.createElement('div');
        document.body.appendChild(containerElement);

        ReactDOM.render(<ConfirmationPopup />, containerElement);
    }

    public render(): React.ReactElement {
        if (!this.props.store.isOpen) {
            return <></>;
        }
        return (
            <div className='popup confirmationPopup'>
                <div className='overlay' />
                <div className='confirmationPopupContent'>
                    { this.renderHeader() }

                    <div className='content'>
                        { this.props.store.message }
                    </div>

                    { this.renderFooter() }
                </div>
            </div>
        );
    }

    private renderHeader(): React.ReactElement {
        return (
            <div className='header align-middle'>
                <span className='float-left'>
                    { this.props.store.headerMessage }
                </span>
                <button type='button' className='close float-right h-100' aria-label='Close' onClick={(): void => {
                    this.props.store.cancel();
                }}>
                    <span aria-hidden='true'>&times;</span>
                </button>
            </div>
        );
    }

    private renderFooter(): React.ReactElement {
        return (
            <div className='footer'>
                <Button outline color='primary' className='float-right' onClick={(): void => {
                    this.props.store.cancel();
                }}>
                    Cancel
                </Button>
                <Button color='primary' className='float-right' onClick={(): void => {
                    this.props.store.confirm();
                }}>
                    Confirm
                </Button>
            </div>
        );
    }
}
