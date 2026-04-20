// @ts-nocheck
// SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { getProbeAuthMode } from "../dist/lib/onboard";

describe("Gemini probe auth mode (issues #1960, #2093)", () => {
  describe("getProbeAuthMode", () => {
    it("returns undefined for gemini-api (uses standard Bearer auth)", () => {
      expect(getProbeAuthMode("gemini-api")).toBeUndefined();
    });

    it("returns undefined for non-Gemini providers", () => {
      expect(getProbeAuthMode("openai-api")).toBeUndefined();
      expect(getProbeAuthMode("nvidia-prod")).toBeUndefined();
      expect(getProbeAuthMode("anthropic-prod")).toBeUndefined();
      expect(getProbeAuthMode("compatible-endpoint")).toBeUndefined();
      expect(getProbeAuthMode("")).toBeUndefined();
    });
  });

  describe("compiled probe retains query-param codepath for future providers", () => {
    const onboardSrc = fs.readFileSync(
      path.join(import.meta.dirname, "..", "dist", "lib", "onboard.js"),
      "utf-8",
    );

    it("contains query-param auth mode logic in probeOpenAiLikeEndpoint", () => {
      expect(onboardSrc).toMatch(/authMode.*===.*"query-param"/);
    });

    it("has encodeURIComponent guard for query-param codepath", () => {
      expect(onboardSrc).toMatch(/\?key=.*encodeURIComponent/);
    });
  });
});
