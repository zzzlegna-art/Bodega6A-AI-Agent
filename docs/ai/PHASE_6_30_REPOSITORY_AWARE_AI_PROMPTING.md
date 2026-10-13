# Phase 6.30 Repository-Aware AI Prompting

## Objective

Connect the Context Builder output with the AI adapter so the model receives relevant Bodega6A project information when processing requests.

## Architecture

User Request

↓

AI Runtime

↓

Repository Intelligence

↓

Context Builder

↓

Repository-Aware Prompt

↓

AI Model

↓

Validated Response

## Responsibilities

The prompting layer should:

- Include relevant project context.
- Maintain user intent.
- Provide structured instructions.
- Reduce irrelevant information.
- Preserve technical accuracy.

## Prompt Components

### System Context

Defines:
- Agent role.
- Platform knowledge.
- Rules.

### User Request

Contains:
- Original instruction.
- Desired outcome.

### Project Context

Contains:
- Relevant files.
- Architecture information.
- Dependencies.

## Safety

Prompts must not bypass security or permission controls.

## Status

Repository-aware prompting architecture prepared.
