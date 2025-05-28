import { styled } from '@mui/system';
import { AppBar, Toolbar, Button } from "@mui/material";

export const StyledTitle = styled('div')({
    flexGrow: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: "large",
    color: "cornflowerblue"
});

export const StyledButton = styled(Button)({
    marginLeft: 'auto',
    background: "black"
});

export const StyledAppBar = styled(AppBar)({
    marginBottom: '20px',
    marginTop: '60px',
    background: "white",
    color: "black"
});

export const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between',
});

