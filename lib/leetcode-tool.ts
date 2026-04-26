import { tool } from "ai";
import { z } from "zod";

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

const SEARCH_QUERY = `
query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters
  ) {
    questions: data {
      title
      titleSlug
      difficulty
      frontendQuestionId: questionFrontendId
    }
  }
}`;

const PROBLEM_DETAIL_QUERY = `
query questionContent($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionFrontendId
    title
    titleSlug
    content
    difficulty
    topicTags {
      name
    }
    hints
    exampleTestcaseList
  }
}`;

async function searchLeetCodeProblem(
  searchQuery: string,
): Promise<{ titleSlug: string; title: string; id: string } | null> {
  const res = await fetch(LEETCODE_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: SEARCH_QUERY,
      variables: {
        categorySlug: "",
        limit: 5,
        skip: 0,
        filters: { searchKeywords: searchQuery },
      },
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  const questions = data?.data?.problemsetQuestionList?.questions;
  if (!questions || questions.length === 0) return null;

  const trimmed = searchQuery.trim();
  if (/^\d+$/.test(trimmed)) {
    const byId = questions.find(
      (q: any) => String(q.frontendQuestionId) === trimmed,
    );
    if (byId)
      return {
        titleSlug: byId.titleSlug,
        title: byId.title,
        id: byId.frontendQuestionId,
      };
  }

  // Otherwise return the top result
  const top = questions[0];
  return {
    titleSlug: top.titleSlug,
    title: top.title,
    id: top.frontendQuestionId,
  };
}

async function fetchProblemDetails(titleSlug: string) {
  const res = await fetch(LEETCODE_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: PROBLEM_DETAIL_QUERY,
      variables: { titleSlug },
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data?.data?.question ?? null;
}

/**
 * Strips HTML tags from LeetCode's HTML content and returns plain text.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * AI SDK tool that fetches LeetCode problem details.
 *
 * Accepts a flexible search query — the model can pass:
 *   - A problem name (e.g. "Two Sum")
 *   - A problem number (e.g. "121")
 *   - Keywords (e.g. "merge sorted lists")
 *
 * The tool searches LeetCode's GraphQL API to resolve the titleSlug,
 * then fetches the full problem details.
 */
export const leetcodeProblemTool = tool({
  description:
    "Fetch LeetCode problem details by searching with a problem name, number, or keywords. " +
    "Use this whenever you need to look up a LeetCode problem's description, constraints, examples, or hints. " +
    "Pass the problem name (e.g. 'Two Sum'), number (e.g. '121'), or descriptive keywords.",
  parameters: z.object({
    searchQuery: z
      .string()
      .describe(
        "The LeetCode problem name, number, or keywords to search for. " +
        "Examples: 'Two Sum', '121', 'merge two sorted lists', 'best time to buy and sell stock'",
      ),
  }),
  // @ts-ignore
  execute: async ({ searchQuery }: { searchQuery: string }) => {
    const match = await searchLeetCodeProblem(searchQuery);
    if (!match) {
      return {
        error: true,
        message: `Could not find a LeetCode problem matching "${searchQuery}". Try using the exact problem name or number.`,
      };
    }

    const details = await fetchProblemDetails(match.titleSlug);
    if (!details) {
      return {
        error: true,
        message: `Found problem "${match.title}" (#${match.id}) but failed to fetch its details.`,
      };
    }

    return {
      error: false,
      problem: {
        id: details.questionFrontendId,
        title: details.title,
        slug: details.titleSlug,
        difficulty: details.difficulty,
        url: `https://leetcode.com/problems/${details.titleSlug}/`,
        description: stripHtml(details.content || ""),
        topicTags: (details.topicTags || []).map((t: any) => t.name),
        hints: details.hints || [],
        exampleTestCases: details.exampleTestcaseList || [],
      },
    };
  },
});
