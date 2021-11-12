import React from 'react';
export default class Com extends React.Component<{
    name: string;
}, {
    age?: number;
}> {
    constructor(props: {
        name: string;
    });
    render(): JSX.Element;
}
