import {
  HeaderContainer,
  TitleContainer,
  BoldTitle,
  QuestionCountContainer,
  OrderButtonsContainer
} from "./headerViewStyle";
import OrderButton from "./orderButton/orderButtonView";
import {
  VoidFunctionType,
  MessageFunctionType
} from "../../../../types/functionTypes";
import { Button, Typography } from "@mui/material";

/**
 * Props for the QuestionHeader component.
 */
interface QuestionHeaderProps {
  title_text: string;
  qcnt: number;
  setQuestionOrder: MessageFunctionType;
  handleNewQuestion: VoidFunctionType;
}

/**
 * QuestionHeader component renders the top section of the question listing page.
 * Includes the title, question count, sorting buttons, and a button to ask a new question.
 *
 * @param {QuestionHeaderProps} props - Props including title, count, sorting handler, and new question callback.
 * @returns {JSX.Element} The rendered header component for the questions list.
 */
const QuestionHeader = ({
                          title_text,
                          qcnt,
                          setQuestionOrder,
                          handleNewQuestion
                        }: QuestionHeaderProps): JSX.Element => {

  return (
      <HeaderContainer>
        <TitleContainer>
          <BoldTitle variant="h4">{title_text}</BoldTitle>
          <Button
              variant="contained"
              style={{ marginRight: "10px", background: "black" }}
              onClick={handleNewQuestion}
          >
            Ask a Question
          </Button>
        </TitleContainer>

        <QuestionCountContainer>
          <Typography variant="subtitle1">{qcnt} Questions</Typography>
          <OrderButtonsContainer>
            <OrderButton
                key={"NewestButton"}
                message={"Newest"}
                setQuestionOrder={setQuestionOrder}
            />
            <OrderButton
                key={"ActiveButton"}
                message={"Active"}
                setQuestionOrder={setQuestionOrder}
            />
            <OrderButton
                key={"UnansweredButton"}
                message={"Unanswered"}
                setQuestionOrder={setQuestionOrder}
            />
          </OrderButtonsContainer>
        </QuestionCountContainer>
      </HeaderContainer>
  );
};

export default QuestionHeader;
