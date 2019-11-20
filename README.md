# cat

This GitHub Action interprets a NUnit Result XML file.

## Usage

### Pre-requisites
Create a workflow `.yml` file in your repositories `.github/workflows` directory. An [example workflow](#example-workflow) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Inputs

* `path` - A file to read from

### Outputs

* `success` - Are all tests successfully passed.
* `testcasecount` - Total test-case count.
* `total` - Total test method count.
* `passed` - Successfully passed test count.
* `failed` - Faied test count.
* `inconclusive` - Incolusive test count.
* `skipped` - Skipped test count.

### Example workflow

```yaml
name: Example

on: push

jobs:
  echo:
    runs-on: ubuntu-latest
    container: docker://gableroux/unity3d:${{ matrix.unity-tag }}
    strategy:
      matrix:
        unity-tag: [2018.4.12f1]
    
    - uses: actions/checkout@master

    - name: Create ULF File
      run: echo -n "${ULF}" > Unity.ulf
      env:
        ULF: ${{ secrets.ulf }}

    - name: License Activation
      run: /opt/Unity/Editor/Unity -logFile -manualLicenseFile Unity.ulf -batchmode -nographics -quit || exit 0

    - name: Run Test
      run: |
        mkdir artifact
        /opt/Unity/Editor/Unity -projectPath . -noGraphics -logFile -batchMode -runEditorTests -editorTestsResultFile ./artifact/result.xml || exit 0

    - uses: pCYSl5EDgo/Unity-Test-Runner-Result-XML-interpreter@master
      id: interpret
      with:
        path: artifact/result.xml

    - if: steps.interpret.outputs.success
      run: echo -n "${{steps.interpret.outputs.total}}"
    
    - if: steps.interpret.outputs.success != 'true'
      run: echo -n "${{steps.interpret.outputs.failed}}"
```

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE)