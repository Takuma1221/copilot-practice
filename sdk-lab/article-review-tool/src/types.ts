import { z } from "zod";

export const findingSchema = z.object({
  severity: z.enum(["high", "medium", "low"]),
  category: z.enum(["facts", "freshness", "structure", "template", "practicality"]),
  issue: z.string(),
  reason: z.string(),
  suggestion: z.string(),
  evidence: z.string(),
});

export const resultSchema = z.object({
  file: z.string(),
  score: z.number().min(0).max(100),
  verdict: z.enum(["pass", "conditional-pass", "fail"]),
  categoryScores: z.object({
    facts: z.number().min(0).max(30),
    freshness: z.number().min(0).max(20),
    structure: z.number().min(0).max(20),
    template: z.number().min(0).max(20),
    practicality: z.number().min(0).max(10),
  }),
  findings: z.array(findingSchema),
});

export const reviewOutputSchema = z.object({
  summary: z.object({
    filesReviewed: z.number().int().nonnegative(),
    totalFindings: z.number().int().nonnegative(),
    passCount: z.number().int().nonnegative(),
    conditionalPassCount: z.number().int().nonnegative(),
    failCount: z.number().int().nonnegative(),
  }),
  results: z.array(resultSchema),
});

export type ReviewOutput = z.infer<typeof reviewOutputSchema>;

export type ReviewConfig = {
  workspaceRoot: string;
  targetDir: string;
  templatePath: string;
  reviewCriteriaPath: string;
  maxFindingsPerFile: number;
  model: string;
  streaming: boolean;
};