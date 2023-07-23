import React, { useEffect } from 'react';
import { TextField } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';

const MotionTextField = motion(TextField)

const ShakeableTextField = ({ value, onChange, error, ...rest }) => {
    const controls = useAnimation();


    useEffect(() => {
        const shakeAnimation = {
            x: [-10, 10, -10, 10, 0],
            transition: { duration: 0.4 },
        };

        const noShakeAnimation = {
            x: 0,
        };

        if (error) {
            controls.start(shakeAnimation);
        } else {
            controls.start(noShakeAnimation);
        }
    }, [controls, error]);

    return (
        <MotionTextField
            value={value}
            onChange={onChange}
            error={Boolean(error)}
            helperText={error}
            animate={controls}
            layout
            {...rest}
        />
    );
};

export default ShakeableTextField;
