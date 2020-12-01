import * as React from 'react';
import classNames from 'classnames';
import './detailsSection.scss';

interface IDetailsSectionProps {
    children: React.ReactNode;
    title: string;
    noBorder?: boolean;
}

const DetailsSection = (props: IDetailsSectionProps): React.ReactElement => {
    return (
        <div className={classNames({
            'w-100': true,
            noBorder: props.noBorder,
            detailsSection: true,
        })} >
            <div className='headline'>
                { props.title }
            </div>
            <div className='content w-100'>
                { props.children }
            </div>
        </div>
    );
}

export default DetailsSection;
