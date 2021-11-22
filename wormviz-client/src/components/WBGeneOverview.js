import React from 'react';

const WBGeneOverview = (props) => {
    const { overview } = props;

    return(
        <div>
            <strong>Overview</strong>
            <p><a href={`https://wormbase.org/species/c_elegans/gene/${overview.name}`}>View {overview.name} on Wormbase</a></p>
            <p>Sequence: {overview.fields.sequence_name.data}</p>
            <p>Type: {overview.fields.classification.data.type}</p>
        </div>
    );
};

export default WBGeneOverview;