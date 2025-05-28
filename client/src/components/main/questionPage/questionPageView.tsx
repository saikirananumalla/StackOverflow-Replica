import "./questionPageView.css";
import QuestionHeader from "./header/headerView";
import Question from "./question/questionView";
import { useQuestionPage } from "../../../hooks/useQuestionPage";
import {
  ClickTagFunctionType,
  VoidFunctionType,
  IdFunctionType,
  OrderFunctionType
} from "../../../types/functionTypes";

/**
 * Props for the QuestionPage component.
 */
export interface QuestionPageProps {
  title_text?: string;
  order: string;
  search: string;
  csrfToken: string;
  setQuestionOrder: OrderFunctionType;
  clickTag: ClickTagFunctionType;
  handleAnswer: IdFunctionType;
  handleNewQuestion: VoidFunctionType;
}

/**
 * QuestionPage component displays a list of questions along with a header and sorting options.
 * Uses `useQuestionPage` to fetch the questions based on search and order.
 * Renders `QuestionHeader` for title and sorting controls, and maps over questions to render each one.
 *
 * @param {QuestionPageProps} props - Includes search params, order, handlers for tags, answers, and new questions.
 * @returns {JSX.Element} A rendered question page with header and list of questions.
 */
const QuestionPage = ({
                        title_text = "All Questions",
                        order,
                        search,
                        setQuestionOrder,
                        clickTag,
                        handleAnswer,
                        handleNewQuestion,
                        csrfToken
                      }: QuestionPageProps): JSX.Element => {

  const { qlist } = useQuestionPage({ order, search, csrfToken });

  return (
      <>
        <QuestionHeader
            title_text={title_text}
            qcnt={qlist.length}
            setQuestionOrder={setQuestionOrder}
            handleNewQuestion={handleNewQuestion}
        />

        <div id="question_list" className="question_list">
          {qlist.map((q, idx) => (
              <Question
                  q={q}
                  key={idx}
                  clickTag={clickTag}
                  handleAnswer={handleAnswer}
              />
          ))}
        </div>

        {title_text === "Search Results" && !qlist.length && (
            <div className="bold_title right_padding">No Questions Found</div>
        )}
      </>
  );
};

export default QuestionPage;
