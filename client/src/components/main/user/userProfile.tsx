import React from "react";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { UserContainer } from "./userStyle";
import { VoidFunctionType } from "../../../types/functionTypes";
import { useUserProfile } from "../../../hooks/useUserProfile";

/**
 * Props for the UserProfile component.
 */
interface UserProfilePageProps {
    csrfToken: string;
    handleLogout: VoidFunctionType;
}

/**
 * `UserProfile` component displays the logged-in user's information (name, email, role)
 * in a styled table layout and provides a logout button.
 * It uses the `useUserProfile` hook to fetch the user's data based on the CSRF token.
 *
 * @param {UserProfilePageProps} props - Contains the CSRF token and logout handler function.
 * @returns {JSX.Element} The rendered user profile page.
 */
const UserProfile = ({ csrfToken, handleLogout }: UserProfilePageProps): JSX.Element => {
    const { user } = useUserProfile(csrfToken);

    return (
        <>
            <UserContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="h6">User Information</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Typography variant="body1">Name</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body1">{user.name}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Typography variant="body1">Email</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body1">{user.email}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Typography variant="body1">Role</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body1">{user.role}</Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </UserContainer>

            <Button
                id="logOutButton"
                variant="contained"
                color="primary"
                onClick={handleLogout}
                style={{ marginRight: "10px", background: "black" }}
            >
                Log out
            </Button>
        </>
    );
};

export default UserProfile;
