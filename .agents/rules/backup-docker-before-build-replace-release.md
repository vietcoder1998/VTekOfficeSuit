# Mandatory Rule: Docker Image Pre-Build Backup & Release Version Promotion (Rule 42)

> **ZERO TOLERANCE**:
> When triggering or executing any Docker build process (`docker build`, compose build, or runtime build services) across all project services:
> 1. **MANDATORY 100%: PRE-BUILD DOCKER BACKUP**:
>    - Before executing build commands, the system MUST verify if the current image exists in the local registry (`${baseImage}:latest` or `${baseImage}:release`).
>    - If the image exists, immediately create a backup tagged as `${baseImage}:build-backup` (`docker tag ${baseImage}:latest ${baseImage}:build-backup`).
> 2. **MANDATORY 100%: PROMOTE RELEASE VERSION UPON SUCCESS**:
>    - When the build finishes with Exit Code 0, tag the new image as official release versions (`${baseImage}:release` and `${baseImage}:latest`).
>    - Simultaneously update `${baseImage}:build-backup` with this new release image for the next build cycle.
> 3. **MANDATORY 100%: ROLLBACK SAFETY ON FAILURE**:
>    - If the build fails (Exit Code ≠ 0), NEVER overwrite the release version. Automatically restore `${baseImage}:latest` and `${baseImage}:release` from `${baseImage}:build-backup`.
>    - Trigger Rule 40 (Verify Build Success & Auto-Fix Bugs) to diagnose and resolve errors.
