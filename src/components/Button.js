import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { purple } from '@mui/material/colors';

function SubmitButton({ children, attributes }) {

    const ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: purple[500],
        '&:hover': {
            backgroundColor: purple[700],
        },
    }));

    return (
        <ColorButton variant="contained" {...attributes}>{children}</ColorButton>
    );
}

export default SubmitButton;


