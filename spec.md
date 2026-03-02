# Specification

## Summary
**Goal:** Remove the Internet Identity login requirement and replace it with a simple name and age onboarding screen.

**Planned changes:**
- Remove the Internet Identity login screen as the app entry point.
- Add a new onboarding screen that asks the user for their name and age only.
- After submitting name and age, take the user directly into the main app.
- Store name and age in localStorage so returning users skip the onboarding screen.
- Read profile data (name, age) from localStorage instead of an authenticated backend actor.

**User-visible outcome:** When opening the app for the first time, users see a simple screen asking for their name and age. After submitting, they go straight into the app. On return visits, they are taken directly to the main app without any re-entry or login required.
