# Todo Evolution Constitution

## Core Principles

### I. API-First Design

All backend functionality must be exposed through well-documented RESTful APIs. The API serves as the single source of truth for data operations, ensuring consistency between frontend, mobile, and any future integrations. Every endpoint must have clear input/output contracts, error handling, and authentication requirements.

### II. Type Safety (NON-NEGOTIABLE)

TypeScript must be used throughout the frontend with strict mode enabled. All API responses must have corresponding TypeScript types. Backend Pydantic schemas must mirror frontend types. No `any` types in production code without explicit justification and TODO comments.

### III. Test-Driven Development

Tests must be written before or alongside implementation code. Priority order:
1. Unit tests for services and utilities
2. Integration tests for API endpoints
3. Contract tests between frontend and backend
4. E2E tests for critical user journeys

All PRs must include tests for new functionality.

### IV. Security First

- Passwords must always be hashed using bcrypt
- JWT tokens must have reasonable expiration times
- All authenticated endpoints must validate tokens
- CORS must be explicitly configured
- SQL injection prevention through SQLAlchemy ORM
- XSS prevention through React's built-in escaping
- Input validation on both frontend and backend

### V. Responsive & Accessible UI

- All pages must be responsive (mobile 320px to desktop 1920px+)
- WCAG 2.1 AA compliance for accessibility
- Keyboard navigation support for all interactive elements
- Proper ARIA labels and semantic HTML
- Color contrast ratios meeting accessibility standards

### VI. Incremental Delivery

Features are delivered in small, testable increments. Each increment must:
- Be independently functional
- Have clear acceptance criteria
- Include tests
- Be deployable without breaking existing functionality

## Code Quality Standards

### Backend (Python/FastAPI)
- Follow PEP 8 style guidelines
- Use type hints for all function signatures
- Docstrings for all public functions and classes
- Dependency injection for testability
- Async/await for I/O operations where beneficial

### Frontend (Next.js/TypeScript)
- Functional components with hooks
- Server components where possible, client components only when needed
- Custom hooks for reusable logic
- Component composition over prop drilling
- Tailwind CSS for styling with consistent design tokens

### Database
- All tables must have primary keys (UUIDs preferred)
- Foreign key constraints for relationships
- Indexes on frequently queried columns
- Migration scripts for all schema changes
- Soft deletes where audit trail is needed

## Development Workflow

### Branch Strategy
- `main` - Production-ready code
- Feature branches: `feature/<feature-name>`
- Bug fixes: `fix/<issue-description>`
- All work done in feature branches with PRs to main

### Commit Standards
- Conventional commits format
- Clear, descriptive commit messages
- Reference issues/tickets where applicable
- Small, focused commits

### Code Review Requirements
- All PRs require at least one review
- CI checks must pass (linting, tests, type checking)
- No direct commits to main branch
- PRs must include description of changes and testing performed

## Quality Gates

### Before Merge
- [ ] All tests passing
- [ ] No type errors
- [ ] Linting passes
- [ ] Code reviewed and approved
- [ ] Documentation updated if needed

### Before Deploy
- [ ] All quality gates passed
- [ ] Manual testing of critical paths completed
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Rollback plan documented

## Observability

### Logging
- Structured JSON logging in production
- Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
- Include request IDs for tracing
- Never log sensitive data (passwords, tokens, PII)

### Monitoring
- Health check endpoint at `/health`
- API response time tracking
- Error rate monitoring
- Database query performance tracking

## Governance

This constitution supersedes all other development practices for the Todo Evolution project. Amendments require:
1. Proposal with rationale
2. Team discussion
3. Documentation of the change
4. Migration plan for existing code if needed

All contributors must acknowledge and follow these principles. Code reviews must verify compliance.

**Version**: 1.0.0 | **Ratified**: 2026-02-23 | **Last Amended**: 2026-02-23
