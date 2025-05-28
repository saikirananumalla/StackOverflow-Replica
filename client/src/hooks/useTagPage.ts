import { useEffect, useState } from "react";
import { getTagsWithQuestionNumber } from "../services/tagService";
import { TagResponseType } from "../types/entityTypes";

/**
 * Custom hook to fetch and manage the list of tags, including
 * the number of questions associated with each tag.
 *
 * Communicates with the `tagService` and is used to populate the Tags page.
 *
 * @param {string} csrfToken - CSRF token used for secure API requests.
 *
 * @returns {{
 *   tlist: TagResponseType[]
 * }} - An object containing the list of tags with associated question counts.
 */
export const useTagPage = (csrfToken: string) => {
  const [tlist, setTlist] = useState<TagResponseType[]>([]);

  /**
   * useEffect that triggers once on component mount to fetch tags.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTagsWithQuestionNumber(csrfToken);
        setTlist(res || []);
      } catch (e) {
        console.error("Error fetching tags:", e);
      }
    };

    fetchData();
  }, [csrfToken]);

  return { tlist };
};
