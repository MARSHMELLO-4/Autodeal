# Shree Ganesh Autodeal Admin App

Flutter owner app for managing bikes, uploading vehicle documents, marking sales, and viewing sales reports.

This machine does not currently have Flutter installed, so generated platform folders are not included. After installing Flutter, run this once inside `mobile-app`:

```powershell
flutter create .
flutter pub get
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080
```

Use `http://10.0.2.2:8080` for the Android emulator. For a physical phone, pass your computer LAN IP, for example:

```powershell
flutter run --dart-define=API_BASE_URL=http://192.168.1.10:8080
```
