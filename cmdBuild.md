## Como fazer Build pelo CMD

Veja https://tarikdahic.com/posts/build-ios-apps-from-the-command-line-using-xcodebuild/

1. entre na pasta raiz do projeto. (onde esta o diretorio .xcodeproj e o diretorio do codigo)

2. limpe qualquer cache
```bash
xcodebuild clean
```

3. Faca o Archive
```bash
xcodebuild archive -scheme <scheme-that-you-want-to-use> -sdk iphoneos -allowProvisioningUpdates -archivePath 
<path-and-name-for-archive>.xcarchive
```
> O scheme pode ser escolhido por rodar o comando `xcodebuild -list -project <project-name>.xcodeproj`


