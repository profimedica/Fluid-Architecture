# Fluid Architecture

A set of tools to allow architecture transitions.

## Why another architecture tools set?

Most of the time architecture consists of a set of document and diagrams that often run out of sync. Mental gymnastics to understand diagrams makes them a bottleneck in development. They often need interpretation or are disconnected from the state of resources.

## Tool 1 - C4 on demand diagrams

Architecture should be technology agnostic, driven by metrics and should adapt to match momentum demands.
With emerging computation power and broader range of integration options, software development as we know today is no longer cost efficient.
We have to leave behind the habbit of relying on architects to produce diagrams is like relying on someone to read the newspaper for you (see how itinerant news readers where reading the newspaper to illiterate commmunities).
This doesen't mean that software develpers or architects are no longer needed, but we need to fight the increasing overlap in responsabilities and allow the propagation of new develpment paradigms.

### How it works?

All resources will have a unique identifier assigned by the an architecture inventory management, we will call it Architecture Identifier.
Where possible, this Architecture Identifier will be referenced (diagrams, code, documents).

Adding the Architecture Identifier as a comment to the code makes it easy to build and maintain relevant links to code. And this keeps diagrams easy to understand, reduces mental gymnastics, makes architecture drift manageable and improves confidence in documentation. It also serves to AI agents as a bridge between requirements, documentation and code. This becomes a must have on the AI adoption strategy.

Code first tagging approach

In this approach, the code exists and you are adding Architecture Identifiers. This is sometimes a reverse engineering or discovery activity. There is a huge amount of legacy software that is bearly maintained but still relevant for the business revenue protection.
A process can periodically collect the Architecture Identifiers or update them in case of undeclared refactoring events. This way the architecture drift can be subjected to reviews and prevents drift flows toward production. It can also run on pipelines to produce alerts or block deployments.

Architecture first tagging approach

In this second approach, the understanding of the requirements exists before any code artefacts. Now the planned resources are described and they are assigned Architecture Identifiers. This will result in a managed temporarely and and expected architecture drift that will be versioned and highlighted on the generated diagrams.

While the architecture inventory grows, adding tags will help you flip scopes and will result in decluttering the generated diagrams.

# Quick start

If you need a custom port number:
dotnet run -- -port=49002