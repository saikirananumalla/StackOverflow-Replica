import { QuestionOrderButton } from "./orderButtonViewStyle";
import { MessageFunctionType } from "../../../../../types/functionTypes";

/**
 * Props for the OrderButton component.
 */
interface OrderButtonProps {
    message: string;
    setQuestionOrder: MessageFunctionType;
}

/**
 * OrderButton component allows the user to set the sorting order for questions.
 * When clicked, it passes the specified order message to the `setQuestionOrder` handler.
 *
 * @param {OrderButtonProps} props - Contains the label for the button and the setter function.
 * @returns {JSX.Element} The rendered button component.
 */
const OrderButton = ({ message, setQuestionOrder }: OrderButtonProps): JSX.Element => {
    return (
        <QuestionOrderButton
            onClick={() => {
                setQuestionOrder(message);
            }}
        >
            {message}
        </QuestionOrderButton>
    );
};

export default OrderButton;
