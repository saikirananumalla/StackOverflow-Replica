import { useEffect, useState } from "react";
import { getQuestionsByFilter } from "../services/questionService";
import { QuestionResponseType } from "../types/entityTypes";

/**
 * Props for the useQuestionPage hook.
 */
interface UseQuestionPageProps {
  order: string;
  search: string;
  csrfToken: string;
}

/**
 * Custom hook to fetch and manage a list of questions based on sorting and search criteria.
 * It calls the backend API to retrieve questions filtered by the given `order` and `search` parameters.
 *
 * @param {UseQuestionPageProps} props - Includes the order, search string, and CSRF token for the request.
 *
 * @returns {{
 *   qlist: QuestionResponseType[]
 * }} - An object containing the list of fetched questions.
 */
export const useQuestionPage = ({ order, search, csrfToken }: UseQuestionPageProps) => {
  const [qlist, setQlist] = useState<QuestionResponseType[]>([]);

  /**
   * useEffect to fetch questions whenever order, search query, or CSRF token changes.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getQuestionsByFilter(order, search, csrfToken);
        setQlist(res || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchData();
  }, [order, search, csrfToken]);

  return { qlist };
};
