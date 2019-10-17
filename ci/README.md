### Windows

Azure listens to release/win and runs azure-pipelines-win.yml.
https://dev.azure.com/Castle-Games/Castle%20Desktop/_build?definitionId=3

### macOS

CircleCI listens to the `release/macos` branch and runs `../.circleci/config.yml`. Also see: [../macosx/DISTRIBUTION.md](../macosx/DISTRIBUTION.md).

### Shared

The pipelines build the installers and then they run 'upload_script.js' in this directory which uploads the binary to our server. It includes that platform name and git hash during the upload. We use a secure file (https://docs.microsoft.com/en-us/azure/devops/pipelines/library/secure-files?view=azure-devops) on Azure and an env var on CircleCI to store a token with admin access that gets passed into the script.

To check for updates, the client calls https://api.castle.games/api/client-release?platform=win&current-git-hash=[HASH]. That returns a JSON object:

```
{
    "url": "http://d2twembh51leha.cloudfront.net/fd7e12ad-8c4b-4627-81aa-4f22d4e9e231",
    "id": 9,
    "gitHash": "878a84054b98fdc95821b86a1c3e4abb39939a5b",
    "platform": "win",
    "currentId": 7, // this might also return null if the provided git hash was not found
}
```

### Debugging

https://dev.azure.com/Castle-Games/_settings/buildqueue?project=Castle%20Desktop&_a=concurrentJobs to change Azure concurrent jobs.
