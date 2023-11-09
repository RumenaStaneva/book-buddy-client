import * as React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel(props) {
    const [progress, setProgress] = useState(props.value);

    useEffect(() => {
        setProgress(props.value);
    }, [props.value]);

    return (
        <Box
            sx={{ display: 'flex', alignItems: 'center' }}
            className='progressbar'
        >
            <Box role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progress: ${progress}%`}
                sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value={progress} aria-label={`Progress: ${progress}%`} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    progress,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
};

export default LinearProgressWithLabel;
