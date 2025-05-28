const months: string[] = [
  "Jan", "Feb", "Mar", "Apr", "May", "June",
  "July", "Aug", "Sept", "Oct", "Nov", "Dec"
];

/**
 * Returns a human-readable string representing the time elapsed
 * since the given date or the formatted date/time.
 *
 * - If posted less than 1 min ago → "X seconds ago"
 * - If less than 1 hour → "X minutes ago"
 * - If less than 24 hours → "X hours ago"
 * - If within the same year → "Month Day at hh:mm:ss"
 * - If over a year → "Month Day, Year at hh:mm:ss"
 *
 * @param {Date} date - The original post date.
 * @returns {string} A formatted relative or absolute date string.
 */
const getMetaData = (date: Date): string => {
  const now = new Date();
  const diffs = Math.floor(Math.abs(now.getTime() - date.getTime()) / 1000);

  if (diffs < 60) {
    return `${diffs} seconds ago`;
  } else if (diffs < 60 * 60) {
    return `${Math.floor(diffs / 60)} minutes ago`;
  } else if (diffs < 60 * 60 * 24) {
    const h = Math.floor(diffs / 3600);
    return `${h} hours ago`;
  } else if (diffs < 60 * 60 * 24 * 365) {
    return `${months[date.getMonth()]} ${getDateHelper(date)} at ${date
        .toTimeString()
        .slice(0, 8)}`;
  } else {
    return `${months[date.getMonth()]} ${getDateHelper(
        date
    )}, ${date.getFullYear()} at ${date.toTimeString().slice(0, 8)}`;
  }
};

/**
 * Pads single-digit day values with a leading zero.
 *
 * @param {Date} date - The date to extract the day from.
 * @returns {string} Day of the month in two-digit format.
 */
const getDateHelper = (date: Date): string => {
  const day = date.getDate();
  return day < 10 ? `0${day}` : `${day}`;
};

/**
 * Parses custom markdown-style hyperlinks in the form [text](https://link)
 * and returns a sanitized HTML link rendered via `dangerouslySetInnerHTML`.
 *
 * @param {string} text - The input string possibly containing markdown links.
 * @returns {JSX.Element} React element with clickable HTML anchors.
 */
const handleHyperlink = (text = "") => {
  const pattern = /\[([^\]]*)\]\(([^)]*)\)/g;

  const replacedText = text.replace(
      pattern,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  return <div dangerouslySetInnerHTML={{ __html: replacedText }} />;
};

/**
 * Validates custom markdown-style hyperlinks in the form [text](https://link).
 *
 * Ensures each link:
 * - Has non-empty display text.
 * - Has a valid HTTPS URL.
 *
 * @param {string} text - The text containing one or more markdown links.
 * @returns {boolean} `true` if all links are valid, `false` otherwise.
 */
const validateHyperlink = (text: string): boolean => {
  const hyperlinkPattern = /\[([^\]]*)\]\(([^)]*)\)/g;
  let isValid = true;

  const matches = [...text.matchAll(hyperlinkPattern)];

  if (matches.length === 0) {
    return isValid;
  }

  for (const match of matches) {
    if (
        !match[1].length ||
        !match[2].length ||
        !match[2].startsWith("https://") ||
        !match[2].slice(8).length
    ) {
      isValid = false;
      break;
    }
  }

  return isValid;
};

export { getMetaData, handleHyperlink, validateHyperlink };
