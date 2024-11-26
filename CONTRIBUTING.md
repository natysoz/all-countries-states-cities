# Contributing to Location Data Package

We appreciate your interest in contributing to the Location Data Package!
Before you begin, please review the following guidelines to help maintain
consistency, code quality,
and ensure the package continues to meet its purpose.

## 1. Commit Message Guidelines: Use Conventional Commits

All contributors must follow
the [Conventional Commits](https://www.conventionalcommits.org/)
specification when making contributions. This ensures that commit messages
are structured and meaningful, making it easier to track changes and releases.

Example Commit Messages:

- `feat: add new endpoint for state retrieval`
- `fix: resolve bug with country filtering`
- `chore: update dependencies`
- `test: add test cases for getCountries function`

### 2. Opening a Pull Request (PR)

When submitting a PR, please include the following information:

- Description of changes: Provide a clear summary of what the PR does, why it is
  necessary, and any related issues.
- Changes in logic: If the PR changes the core logic of the package, explain why
  and how it impacts the existing functionality.
- Tests: Confirm that all existing tests pass and that new tests are added if
  required.

### 3. Submitting Logic Changes

If you are making changes to the core logic of the package:

- Open a PR with detailed information on what was changed and why.
- Ensure that all tests pass after the changes.
- Add any new tests that are required to cover the updated logic.

### 4. Adding New Data

When adding or updating data (e.g., countries, states, cities):

- You must provide the complete data set. For example, if a country has 9
  properties, your PR must include all 9 properties for the updated or added
  country.
- Partial or incomplete data submissions will not be accepted and the PR will be
  rejected.

### 5. Testing

- Run all existing tests before submitting a PR to ensure that nothing is
  broken.
- If your changes affect the behavior of the package, add new test cases to
  cover the changes.
- Use Vitest for testing as it is the framework used in this project.

### 6. General Guidelines

- Keep your changes focused and minimal. Each PR should have a clear, focused
  purpose.
- If your PR includes formatting changes or other non-functional updates,
  separate these from changes that impact the logic or behavior.
- Be respectful of code style and format to maintain consistency.

## Happy coding 🚀
