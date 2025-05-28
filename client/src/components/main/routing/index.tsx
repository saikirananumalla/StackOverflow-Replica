import {
  PageSetterFunctionType,
  ClickTagFunctionType,
  IdFunctionType,
  VoidFunctionType,
  OrderFunctionType,
  DeleteQuestionFunctionType,
  DeleteAnswerFunctionType,
  DeleteCommentFunctionType,
  CommentFunctionType,
} from "../../../types/functionTypes";

/**
 * Props used to initialize a PageClass instance.
 */
export interface PageClassProps {
  search: string;
  title: string;
  questionOrder: string;
  qid: string;
  csrfToken: string;
  mod: string;
  pid: string;
  pqid: string;
  parent: string;
  setQuestionPage: PageSetterFunctionType;
  setQuestionOrder: OrderFunctionType;
  handleQuestions: VoidFunctionType;
  handleTags: VoidFunctionType;
  handleAnswer: IdFunctionType;
  clickTag: ClickTagFunctionType;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: IdFunctionType;
  handleLogout: VoidFunctionType;
  handleComment: CommentFunctionType;
  handleDeleteQuestion: DeleteQuestionFunctionType;
  handleDeleteAnswer: DeleteAnswerFunctionType;
  handleDeleteComment: DeleteCommentFunctionType;
}

/**
 * The base class for all pages rendered inside the `Main` component.
 * Child classes should override `getContent()` to return JSX content for the page.
 * Optionally, `getSelected()` can be overridden to indicate which sidebar/tab is selected.
 */
class PageClass {
  /** The current search query */
  search: string;

  /** Title text for the page */
  title: string;

  /** Sets the current question page (used for navigation) */
  setQuestionPage: PageSetterFunctionType;

  /** Current ordering mode (e.g., 'Newest', 'Active') */
  questionOrder: string;

  /** Function to update the question ordering */
  setQuestionOrder: OrderFunctionType;

  /** The ID of a specific question */
  qid: string;

  /** Function to fetch and render the list of questions */
  handleQuestions: VoidFunctionType;

  /** Function to fetch and render the list of tags */
  handleTags: VoidFunctionType;

  /** Function to navigate to a question's answer page */
  handleAnswer: IdFunctionType;

  /** Function to handle tag click actions */
  clickTag: ClickTagFunctionType;

  /** Function to trigger creation of a new question */
  handleNewQuestion: VoidFunctionType;

  /** Function to trigger creation of a new answer */
  handleNewAnswer: IdFunctionType;

  /** CSRF token used for secure requests */
  csrfToken: string;

  /** Function to log out the current user */
  handleLogout: VoidFunctionType;

  /** Comment ID */
  pid: string;

  /** Parent question ID of a comment */
  pqid: string;

  /** Parent type: 'question' or 'answer' */
  parent: string;

  /** Function to add a new comment */
  handleComment: CommentFunctionType;

  /** Moderator flag or user role */
  mod: string;

  /** Function to delete a question */
  handleDeleteQuestion: DeleteQuestionFunctionType;

  /** Function to delete an answer */
  handleDeleteAnswer: DeleteAnswerFunctionType;

  /** Function to delete a comment */
  handleDeleteComment: DeleteCommentFunctionType;

  constructor(props: PageClassProps) {
    this.search = props.search;
    this.title = props.title;
    this.setQuestionPage = props.setQuestionPage;
    this.questionOrder = props.questionOrder;
    this.setQuestionOrder = props.setQuestionOrder;
    this.qid = props.qid;
    this.handleQuestions = props.handleQuestions;
    this.handleTags = props.handleTags;
    this.handleAnswer = props.handleAnswer;
    this.clickTag = props.clickTag;
    this.handleNewQuestion = props.handleNewQuestion;
    this.handleNewAnswer = props.handleNewAnswer;
    this.csrfToken = props.csrfToken;
    this.handleLogout = props.handleLogout;
    this.pid = props.pid;
    this.pqid = props.pqid;
    this.parent = props.parent;
    this.handleComment = props.handleComment;
    this.mod = props.mod;
    this.handleDeleteQuestion = props.handleDeleteQuestion;
    this.handleDeleteAnswer = props.handleDeleteAnswer;
    this.handleDeleteComment = props.handleDeleteComment;
  }

  /**
   * Returns the content to be rendered for this page.
   * Should be overridden by subclasses.
   *
   * @returns {React.ReactNode} The JSX content for the page.
   */
  getContent(): React.ReactNode {
    return null;
  }

  /**
   * Returns the identifier of the currently selected tab (if applicable).
   * Default is an empty string.
   *
   * @returns {string} Selected tab identifier.
   */
  getSelected(): string {
    return "";
  }
}

export default PageClass;
