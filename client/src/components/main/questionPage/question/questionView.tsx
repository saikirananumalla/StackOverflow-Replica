import {
  QuestionContainer,
  QuestionAuthor,
  QuestionMeta,
  QuestionMid,
  QuestionTags,
  QuestionTagButton,
  LastActivity,
  PostStats,
  PostTitle
} from "./questionViewStyle";
import { getMetaData } from "../../../../utils";
import {
  ClickTagFunctionType,
  IdFunctionType
} from "../../../../types/functionTypes";
import { QuestionResponseType } from "../../../../types/entityTypes";

/**
 * Props for the Question component.
 */
interface QuestionProps {
  q: QuestionResponseType;
  clickTag: ClickTagFunctionType;
  handleAnswer: IdFunctionType;
}

/**
 * Question component displays a single question preview in the list.
 * Includes the title, tags, stats (votes, answers, views), and metadata about the question.
 * Clicking on the question triggers navigation to the full question page.
 * Tag buttons can be clicked to filter questions by tag without triggering question navigation.
 *
 * @param {QuestionProps} props - Props including question data, tag click handler, and answer navigation handler.
 * @returns {JSX.Element} The rendered preview for an individual question.
 */
const Question = ({ q, clickTag, handleAnswer }: QuestionProps): JSX.Element => {
  return (
      <QuestionContainer
          onClick={() => {
            handleAnswer(q._id);
          }}
      >
        <PostStats className="postStats">
          <div>{q.vote_count} votes</div>
          <div>{q.answers.length || 0} answers</div>
          <div>{q.views} views</div>
        </PostStats>

        <QuestionMid>
          <PostTitle className="postTitle">{q.title}</PostTitle>
          <QuestionTags className="questionTags">
            {q.tags.map((tag, idx) => (
                <QuestionTagButton
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      clickTag(tag.name);
                    }}
                    className="questionTagButton"
                    style={{
                      marginRight: "10px",
                      background: "lightskyblue",
                      color: "black",
                      textTransform: "none",
                      borderRadius: "7px",
                      fontSize: "small"
                    }}
                >
                  {tag.name}
                </QuestionTagButton>
            ))}
          </QuestionTags>
        </QuestionMid>

        <LastActivity>
          <QuestionAuthor>{q.asked_by}</QuestionAuthor>
          <div>&nbsp;</div>
          <QuestionMeta>
            asked {getMetaData(new Date(q.ask_date_time))}
          </QuestionMeta>
        </LastActivity>
      </QuestionContainer>
  );
};

export default Question;
